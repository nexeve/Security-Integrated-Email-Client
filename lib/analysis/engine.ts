import { RawEmail, ExtendedAnalysisResult, ThreatIndicator, URLIntelligenceItem, AttackType } from '../types';
import { AnalysisEngine, AnalysisConfig, AnalysisOptions } from './types';
import { analyzeAuthentication } from './analyzers/authentication';
import { analyzeIdentity } from './analyzers/identity';
import { analyzeContent } from './analyzers/content';
import { analyzeUrls } from './analyzers/url';
import { analyzeAttachments } from './analyzers/attachment';
import { analyzeOrigin } from './analyzers/origin';
import { calculateCorrelatedScore } from './scoring';
import { ThreatIntelProvider, getThreatIntelProvider } from './services/threat-intel';
import { GeolocationService, GeolocationData, isPrivateOrReservedIP } from './services/geolocation';

/**
 * In-process analysis result caches.
 *
 * Two separate caches are maintained:
 *
 *  lightCache — Results produced with skipGeo = true (inbox list endpoint).
 *               Contains full security analysis; geo fields are "Unavailable".
 *               Used by the list API to keep inbox loading fast.
 *
 *  fullCache  — Results produced with skipGeo = false (email detail endpoint).
 *               Contains real geolocation data for the Analytics map.
 *               Populated on first visit to the analytics page for an email.
 *
 * Keys are Gmail message IDs (stable for the lifetime of the message).
 * Entries survive until the server process restarts.
 * A production deployment would replace these with Redis / persistent KV,
 * keyed by (message-id + internalDate) to detect mutations.
 *
 * The server remains the authority for all analysis. These caches are
 * server-side only — never exposed directly to the client.
 */
const lightCache = new Map<string, ExtendedAnalysisResult>();
const fullCache  = new Map<string, ExtendedAnalysisResult>();

// ── Stub geo result used when skipGeo = true ─────────────────────────────────
const GEO_UNAVAILABLE: GeolocationData = {
  ip: 'Unavailable',
  country: 'Unavailable',
  confidence: 'low',
  approximate: true,
  skipReason: 'no_provider',
};

export class HeuristicAnalysisEngine implements AnalysisEngine {
  private config: AnalysisConfig;
  private threatIntel: ThreatIntelProvider;
  private geoService: GeolocationService;

  constructor(config: AnalysisConfig = { enableHeuristics: true }) {
    this.config = config;
    this.threatIntel = getThreatIntelProvider();
    this.geoService = new GeolocationService();
  }

  async analyze(email: RawEmail, options?: AnalysisOptions): Promise<ExtendedAnalysisResult> {
    const skipGeo = options?.skipGeo === true;

    // ── Cache lookup ─────────────────────────────────────────────────────────
    // Use the full cache for geo-enabled calls; fall through to light cache
    // only when skipGeo is requested.
    if (!skipGeo) {
      const cached = fullCache.get(email.id);
      if (cached) return cached;
    } else {
      const cached = lightCache.get(email.id);
      if (cached) return cached;
    }

    // ── 1. Evidence extraction ───────────────────────────────────────────────
    const authFindings = analyzeAuthentication(email);
    const originFindings = analyzeOrigin(email);

    const threatIndicators: ThreatIndicator[] = [];

    if (this.config.enableHeuristics) {
      threatIndicators.push(...analyzeIdentity(email));
      threatIndicators.push(...analyzeContent(email));
      threatIndicators.push(...analyzeUrls(email));
      threatIndicators.push(...analyzeAttachments(email));
      threatIndicators.push(...originFindings.indicators);
    }

    // ── 2. URL threat intelligence ───────────────────────────────────────────
    const combinedText = email.body + ' ' + (email.htmlBody || '');
    const urlRegex = /(https?:\/\/[^\s<"']+)/g;
    const rawUrls = Array.from(
      new Set(
        (combinedText.match(urlRegex) || []).map(url => {
          const clean = url.replace(/[.,;!]+$/, '');
          try { return decodeURIComponent(clean); } catch { return clean; }
        })
      )
    );

    // URL intel calls are independent → run in parallel (VoidProvider is sync-fast;
    // real providers benefit from bounded concurrency, but URL count is typically small).
    const urlIntelligence: URLIntelligenceItem[] = await Promise.all(
      rawUrls.map(u => this.threatIntel.checkUrl(u))
    );

    for (const intel of urlIntelligence) {
      if (intel.reputation === 'malicious') {
        threatIndicators.push({
          id: 'KNOWN_MALICIOUS_URL',
          category: 'malware',
          severity: 'critical',
          confidence: 'high',
          title: 'Known Malicious URL',
          explanation:
            'A URL in the email matches a known malicious domain from the threat intelligence provider.',
          evidence: `URL: ${intel.url}`,
          source: 'threat-intel',
          contributesToRisk: true,
        });
      }
    }

    // ── 3. Scoring ───────────────────────────────────────────────────────────
    const scoringResult = calculateCorrelatedScore(authFindings, threatIndicators);

    // ── 4. Confidence ────────────────────────────────────────────────────────
    let overallConfidence = 50;
    if (authFindings.spf.status !== 'unknown') overallConfidence += 15;
    if (authFindings.dkim.status !== 'unknown') overallConfidence += 15;
    if (originFindings.earliestReliableIp) overallConfidence += 20;
    if (
      authFindings.dmarc.status === 'fail' ||
      urlIntelligence.some(u => u.reputation === 'malicious') ||
      email.attachments?.length
    ) {
      overallConfidence = 95;
    }
    overallConfidence = Math.min(100, Math.max(0, overallConfidence));

    // ── 5. AI investigation summary ──────────────────────────────────────────
    let executiveAssessment: string;
    if (scoringResult.safetyScore >= 95) {
      executiveAssessment = 'No meaningful risk evidence detected. Standard business communication.';
    } else if (scoringResult.safetyScore >= 75) {
      executiveAssessment = 'Minor risk indicators detected, likely safe but exercise normal caution.';
    } else if (scoringResult.safetyScore >= 50) {
      executiveAssessment = 'Moderate risk indicators present. Review sender and links carefully.';
    } else {
      executiveAssessment = 'High risk indicators detected. Strong evidence of potential threat.';
    }

    const aiInvestigation = {
      executiveAssessment,
      keyEvidence: scoringResult.scoreFactors.map(f => f.description),
      socialEngineeringIndicators: threatIndicators
        .filter(t => t.category === 'social_engineering')
        .map(t => t.title),
      recommendedActions:
        scoringResult.safetyScore < 75
          ? ['Verify sender', 'Do not click links']
          : ['No specific action required'],
      confidence: overallConfidence,
      analysisTimestamp: new Date().toISOString(),
    };

    // ── 6. Geolocation — only for public IPs, only when not skipped ──────────
    //
    // skipGeo = true:  Skip all external calls. Geo fields = "Unavailable".
    //                  Used by the inbox list endpoint for fast response.
    //
    // skipGeo = false: Geolocate public relay IPs in parallel, bounded by
    //                  GEO_TIMEOUT_MS inside the provider.  Private / reserved
    //                  IPs are rejected inside GeolocationService without any
    //                  network call.  Repeated public IPs hit the in-process
    //                  cache.  Provider failure returns an "unavailable" result
    //                  so analysis continues uninterrupted.
    let geoData = GEO_UNAVAILABLE;
    let relayPath: ExtendedAnalysisResult['originAnalysis']['relayPath'] = [];

    if (!skipGeo) {
      const publicRelayIps = originFindings.relayIps.filter(ip => !isPrivateOrReservedIP(ip));

      const [resolvedGeoData, ...relayGeoResults] = await Promise.all([
        this.geoService.getGeolocation(originFindings.earliestReliableIp),
        ...publicRelayIps.map(ip => this.geoService.getGeolocation(ip)),
      ]);

      geoData = resolvedGeoData;

      relayPath = publicRelayIps.map((ip, i) => {
        const geo = relayGeoResults[i];
        // Mark the earliest reliable IP as the origin hop so the map can
        // style it distinctly and MapBounds can fit the view around it.
        const isEarliestOrigin = ip === originFindings.earliestReliableIp;
        return {
          hopNumber: i + 1,
          ip,
          confidence: geo.confidence,
          role: isEarliestOrigin ? 'earliest_origin' as const : 'relay' as const,
          location: {
            // Only real coordinates from the provider — never fabricated.
            latitude: geo.latitude,
            longitude: geo.longitude,
            country: geo.country,
            city: geo.city,
          },
        };
      });
    }

    // ── 7. Build result ──────────────────────────────────────────────────────
    const result: ExtendedAnalysisResult = {
      safetyScore: scoringResult.safetyScore,
      category: scoringResult.category,
      threatIndicators,
      securityChecks: authFindings,
      geolocation: {
        country: geoData.country,
        city: geoData.city,
        ip: geoData.ip,
        latitude: geoData.latitude,
        longitude: geoData.longitude,
        accuracy: geoData.confidence,
      },
      forensicDetails: {
        summary: executiveAssessment,
        scoreFactors: scoringResult.scoreFactors,
        technicalDetails: {
          headers: {
            'Message-ID': email.headers.messageId || 'Unavailable',
            Date: email.headers.date.toISOString(),
            From: email.headers.from.email,
          },
          analysisTimestamp: new Date().toISOString(),
          analysisVersion: '3.1.0-deterministic',
        },
        recommendations: aiInvestigation.recommendedActions,
      },
      threatOverview: {
        riskLevel: scoringResult.riskLevel,
        confidence: overallConfidence,
        safetyScore: scoringResult.safetyScore,
        verdict: scoringResult.verdict,
        attackType:
          threatIndicators.length > 0 ? (threatIndicators[0].category as AttackType) : 'none',
        phishingClassification: 'none',
        socialEngineeringDetected: threatIndicators.some(t => t.category === 'social_engineering'),
        urlCount: rawUrls.length,
        attachmentCount: email.attachments?.length || 0,
        threatIndicatorCount: threatIndicators.length,
        reputationCheckCount: urlIntelligence.length,
      },
      originAnalysis: {
        earliestReliableIP: originFindings.earliestReliableIp || 'Unavailable',
        confidence: overallConfidence > 75 ? 'high' : 'medium',
        senderDomain: email.headers.from.email.split('@')[1] || 'Unavailable',
        replyToDomain: email.headers.replyTo?.split('@')[1] || 'Unavailable',
        relayPath: relayPath as import('../types').RelayHop[],
        earliestOrigin: {
          ip: originFindings.earliestReliableIp || 'Unavailable',
          location: {
            country: geoData.country,
            city: geoData.city,
            // Preserve real coordinates so consumers can use them independently
            // without having to dig through relayPath.
            latitude: geoData.latitude,
            longitude: geoData.longitude,
            isp: geoData.isp,
          },
        },
        totalHops: originFindings.relayIps.length,
      },
      aiInvestigation,
      urlIntelligence,
      evidencePackage: {
        reportId: `RPT-DET-${email.id}`,
        generatedAt: new Date().toISOString(),
        analysisVersion: '3.1.0-deterministic',
        canExport: true,
        exportFormats: ['pdf', 'json'],
        summary: executiveAssessment,
      },
    };

    // ── 8. Store in appropriate cache and return ──────────────────────────────
    if (skipGeo) {
      lightCache.set(email.id, result);
    } else {
      fullCache.set(email.id, result);
    }
    return result;
  }
}

export const analysisEngine = new HeuristicAnalysisEngine();
