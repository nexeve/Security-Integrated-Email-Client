# Cyber Leek Analysis Engine Architecture

## 1. Overview
The Cyber Leek Analysis Engine has been redesigned to use a deterministic, evidence-based approach. The engine extracts facts from the `RawEmail` object, analyzes them using isolated heuristics, correlates related findings, and computes a risk score and verdict without relying on randomness, fabricated intelligence, or black-box overrides.

## 2. Evidence Model
The analysis operates in stages:
- **Raw Observations**: E.g., The string `From: accounts.google.com`
- **Normalized Facts**: The organizational domain is `google.com`
- **Evidence**: `google.com` matches the `Return-Path` organizational domain.
- **Findings**: The `Identity Analyzer` outputs no spoofing threat indicators.
- **Correlation**: Related weak signals (e.g. urgency and credential requests) are combined into a single, cohesive `ThreatIndicator`.
- **Score & Verdict**: A deterministic risk score is generated from the combined findings, leading to a verdict such as `safe`, `suspicious`, or `malicious`.

## 3. Analyzers
The engine consists of several focused analyzers:
- **Authentication Analyzer**: Evaluates SPF, DKIM, and DMARC. Distinctly handles missing authentication (returning `unknown` instead of `fail`).
- **Identity Analyzer**: Checks organizational domain alignment between From and Reply-To/Return-Path to reduce false positives on valid cross-subdomain bouncing. Detects deceptive domain constructions.
- **Content Analyzer**: Evaluates semantic behavior (urgency + login links) rather than relying blindly on security keyword blocklists.
- **URL Analyzer**: Extracts hostnames and evaluates IP-based URLs, credentials in URLs, and deceptive constructions.
- **Attachment Analyzer**: Highlights inherently dangerous extensions (e.g. `.exe`) and evasion techniques like double-extensions.
- **Origin Analyzer**: Parses `Received` IPs explicitly. Returns available facts without generating mock geolocation coordinates.

## 4. Scoring Model
The system uses a proportional reduction scoring model, starting at `100` (No threat detected).
1. **Authentication Impact**: Explicit fails reduce the score significantly (-20), while missing auth yields a minor penalty (-5).
2. **Indicator Correlation**: The highest severity within a given category (e.g., `phishing`, `social_engineering`) dictates the risk penalty for that group, preventing linear double-counting of multiple weak signals from the same underlying threat.
3. **Thresholds**: 
   - 95-100: Safe
   - 75-94: Low Risk
   - 50-74: Medium Risk
   - 25-49: High Risk
   - 0-24: Critical Risk

## 5. Confidence Model
Confidence reflects the availability and quality of evidence rather than the outcome. A high confidence means we have conclusive data (e.g. passing SPF/DKIM). Low confidence implies missing data (e.g. no authentication headers, no URLs).

## 6. Threat Indicators
Each `ThreatIndicator` provides structured, explainable context:
- `id`: A stable unique identifier for the finding.
- `category`: The overarching threat grouping (e.g. `phishing`).
- `severity` & `confidence`: Categorical assessments of the risk and evidence.
- `title` & `explanation`: Human-readable context for the user interface.
- `evidence`: The specific observed fact that triggered the indicator.
- `contributesToRisk`: Boolean determining if it altered the safety score.

## 7. Determinism
All forms of randomness (e.g. `Math.random()`), fabricated timestamps, and mock data insertion have been removed. If data is not available from the `RawEmail` object or an explicitly configured intelligence provider, the engine outputs `Unavailable` or returns empty arrays. This guarantees that a given input email will always produce the exact same `ExtendedAnalysisResult`.

## 8. Threat Intelligence Boundary
URL threat intelligence is isolated behind the `ThreatIntelProvider` interface (`lib/analysis/services/threat-intel.ts`). The default `VoidThreatIntelProvider` outputs `reputation: 'unknown'` and `providerStatus: 'unavailable'` when no external provider is configured. When a `SAFE_BROWSING_API_KEY` is provided, `GoogleSafeBrowsingProvider` activates. Real intelligence feeds remain decoupled from internal heuristics and zero fabricated reputation data is generated.

## 9. Future Integration
Because the analysis result schema remains strictly decoupled from the heuristic generation code, this prototype TypeScript engine can be cleanly replaced by an advanced Machine Learning Python API Backend. The backend must simply return the same `ExtendedAnalysisResult` schema.
