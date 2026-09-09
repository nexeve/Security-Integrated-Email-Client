<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

# Cyber Leek — Project Agent Instructions

## 1. Project Identity

**Cyber Leek** is a **secure-by-design webmail client** — an integrated email application with native security analysis built directly into the email experience.

- Users browse an inbox, open and read emails, and view security information without leaving the client.
- It is **not** an email-upload tool or a standalone header analysis service.
- Security analysis runs automatically as part of the normal email workflow — not as a separate step the user must initiate.
- Do not replace the webmail client architecture with an upload-email-and-analyze workflow under any circumstances.
- Do not use, copy, or import code from any external "email threat detection" project. All implementation must originate from this codebase.

---

## 2. Current Architecture

### Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| UI | React 19 |
| Styling | Tailwind CSS v4 (`@tailwindcss/postcss`, `@theme inline`) |
| Components | Shadcn/ui base (`base-nova` style), `@base-ui/react` primitives |
| Data Fetching | TanStack React Query v5 |
| Animation | Framer Motion v13 |
| Icons | Lucide React |
| Map | Leaflet 1.9.4 + React-Leaflet 5 |
| Validation | Zod v4 |
| API | Next.js Route Handlers (`app/api/`) |

### Key Architectural Notes

- **Tailwind v4 syntax only.** There is no `tailwind.config.js`. Config uses `@theme inline {}` in `globals.css`. Do not introduce Tailwind v3 config patterns.
- **`params` in App Router pages is an async `Promise<{ id: string }>`.** Always await or use `React.use(params)` — never access `params.id` directly.
- **Leaflet requires `{ ssr: false }` dynamic import.** Never import Leaflet or React-Leaflet directly in server-rendered code. The `window` / `document` guard pattern is mandatory.
- **React 19 enforces immutability.** Do not mutate variables defined outside a component (e.g., prototype patching on module-level globals). Use `useEffect` for side effects with external libraries.
- **All current pages use `'use client'`** due to React Query hooks. Do not remove client directives without auditing data dependencies.

### Directory Map

```
app/
  api/emails/route.ts            # GET /api/emails — list with AnalysisResult
  api/emails/[id]/route.ts       # GET /api/emails/[id] — full ExtendedAnalysisResult
  email/[id]/page.tsx            # Email reader page
  email/[id]/analytics/page.tsx  # Deep forensic analytics page
  page.tsx                       # Inbox page
  globals.css                    # Tailwind v4 tokens and base styles
  layout.tsx                     # Root layout, fonts, QueryClient provider

components/
  layout/                        # AppHeader, Sidebar, MainLayout
  inbox/                         # EmailRow, EmailCard
  email-view/                    # EmailView, SafetyScoreBadge, SecurityChecks,
                                 # ThreatIndicators, SafetyScore, ForensicPanel,
                                 # OriginInfo, EmailContent
  analytics/                     # SecurityAnalytics (orchestrator), ThreatOverview,
                                 # EmailDetails, OriginRelayAnalysis, MapComponent,
                                 # AIInvestigation, URLIntelligence, EvidencePackage
  shared/                        # AnalysisLoading
  ui/                            # Button, Badge, Card (Shadcn primitives)
  providers.tsx                  # TanStack QueryClientProvider

lib/
  types.ts                       # All shared types: RawEmail, AnalysisResult,
                                 # ExtendedAnalysisResult, ThreatOverview,
                                 # OriginAnalysis, AIInvestigation, etc.
  utils.ts                       # Re-exports cn() from "cn" package
  api/emails.ts                  # useEmails() and useEmail(id) React Query hooks
  analysis/
    types.ts                     # AnalysisEngine interface, AnalysisConfig
    engine.ts                    # HeuristicAnalysisEngine (singleton: analysisEngine)
    rules/                       # scoring.ts, security-checks.ts, threat-detection.ts
    mock/                        # geolocation.ts, origin-analysis.ts,
                                 # threat-overview.ts, ai-investigation.ts,
                                 # url-intelligence.ts, sample-emails.ts
    services/
      geolocation-service.ts     # MockGeolocationService (replaceable interface)
```

### Data Flow

```
useEmails() / useEmail(id)
  → GET /api/emails or /api/emails/[id]
    → getSampleEmail(id) / getAllSampleEmails()     # mock data store
    → analysisEngine.analyze(email)                 # synchronous engine call
      → checkSPF / checkDKIM / checkDMARC
      → detectPhishing / detectSpoofing / detectSuspiciousAttachments
      → calculateSafetyScore / determineCategory
      → getGeolocation
      → generateThreatOverview / generateOriginAnalysis
      → generateAIInvestigation / generateURLIntelligence
    → returns ExtendedAnalysisResult
  → JSON response
→ React component renders
```

---

## 3. Security & Forensics Architecture

The analysis engine produces an `ExtendedAnalysisResult` containing these structured sections:

| Section | Type | Description |
|---|---|---|
| **Safety Score** | `number` (0–100) | Computed from SPF/DKIM/DMARC passes, threat severity impacts, and attachment penalties. |
| **Category** | `EmailCategory` | `normal`, `promotional`, `spam`, `suspicious`, `malicious` — describes what the email *is*, independent of score. |
| **Threat Indicators** | `ThreatIndicator[]` | Heuristic detections: phishing, spoofing, impersonation, suspicious-links, suspicious-attachment. Each has type, severity, description, evidence. |
| **Security Checks** | `{ spf, dkim, dmarc }` | Per-protocol `SecurityCheckResult` with status (`pass`, `fail`, `neutral`, `unknown`) and domain context. |
| **Geolocation** | `GeolocationInfo` | Origin IP, country, city, region, ISP, and accuracy. Currently mock-only. |
| **Threat Overview** | `ThreatOverview` | Risk level, verdict, attack type, phishing classification, social engineering flag, URL/attachment/indicator counts. |
| **Origin Analysis** | `OriginAnalysis` | Earliest reliable IP, sender/reply-to domain alignment, and relay path (`RelayHop[]`) with coordinates. |
| **AI Investigation** | `AIInvestigation` | Executive assessment, key evidence, social engineering indicators, recommended actions, confidence score. |
| **URL Intelligence** | `URLIntelligenceItem[]` | Extracted URLs with domain reputation, risk score, threat type, and timestamps. |
| **Evidence Package** | `EvidencePackage` | Report ID, generated timestamp, version, export format targets (`pdf`, `json`, `xml`). |
| **Forensic Details** | `ForensicInfo` | Score factor breakdown, forensic summary, technical headers, and recommendations. |

The `AnalysisEngine` interface in `lib/analysis/types.ts` defines a single method `analyze(email: RawEmail): AnalysisResult`. The heuristic implementation in `engine.ts` satisfies this contract. Do not couple UI components to implementation-specific engine details — only use `AnalysisResult` and `ExtendedAnalysisResult` types.

---

## 4. Architectural Constraints

- **Preserve existing functionality** unless a task explicitly requires changing it.
- **Preserve existing API routes and data contracts.** Do not change the response shape of `/api/emails` or `/api/emails/[id]` unless a task requires it.
- **Keep the analysis engine and UI decoupled.** The TypeScript engine is a prototype. A future Python/Django/ML service must be able to replace it by satisfying the same `AnalysisEngine` interface and returning the same structured types without requiring UI changes.
- **Keep mock data generators replaceable.** The files in `lib/analysis/mock/` and `lib/analysis/services/geolocation-service.ts` are prototype stubs — not production implementations. Do not hard-couple UI logic to their internal behavior.
- **Do not delete existing components or features** to simplify an implementation. Prefer extending, adjusting, or wrapping.
- **Do not restructure the App Router file layout** unless a task explicitly requires it.

---

## 5. Geolocation Constraints

- The Leaflet map in `components/analytics/MapComponent.tsx` is a **prototype visualization only**.
- Relay hop coordinates in `lib/analysis/mock/origin-analysis.ts` are **fabricated** from a deterministic algorithm — they are not real intelligence.
- **Private/internal IPs** (`10.x.x.x`, `192.168.x.x`, `172.16–31.x.x`) must never be represented as public geographic origins. They should be flagged and excluded from geographic display.
- When implementing real geolocation in the future: implement it behind the `GeolocationService` interface in `lib/analysis/services/geolocation-service.ts`, not directly in components or mock files.
- Leaflet CSS must be bundled locally (via the installed npm package) rather than fetched from an external CDN at runtime.
- Dark map tiles (e.g. CartoDB Dark Matter) are preferred to match the visual theme.

---

## 6. UI Direction

### Desired Visual Language

Cyber Leek targets a **dark atmospheric glass** aesthetic — intentionally distinct from both generic SaaS dashboards and stereotypical cyberpunk imagery.

**Foundation:**
- Deep blue and blue-charcoal backgrounds as the base layer
- Translucent, layered surfaces (glass-like card surfaces with subtle inner light)
- Restrained cyan illumination for active states, data highlights, and score indicators
- Soft, rounded geometry throughout

**Surfaces & Depth:**
- Cards and panels feel like frosted glass mounted above a dark substrate
- Subtle depth differentiation between background, surface, and elevated layers
- Soft reflections or inner highlights to suggest physical materiality (not excessive)

**Controls & Typography:**
- Tactile, subtle skeuomorphic controls — buttons and inputs with slight depth, press states with tactile micro-feedback
- Clean, readable typography with strong hierarchy
- Legibility is non-negotiable; decorative text effects must not reduce readability

**Motion:**
- Restrained and purposeful — entry animations, hover states, score gauge fills
- No gratuitous looping animations or attention-seeking effects

**Color usage:**
- Use semantic Tailwind CSS variable tokens for all colors — no hardcoded `gray-`, `blue-`, or `red-` utilities
- Reserve cyan/accent for data-driven meaning (safety scores, active states, threat severity)
- Use opacity modifiers for depth layering rather than separate color definitions

### Avoid

- Generic SaaS / "enterprise dashboard" styling
- Generic Apple or Vercel glassmorphism pastiche
- Excessive neon or glow effects
- Excessive blur that degrades readability
- Stereotypical cyberpunk aesthetics (grid lines everywhere, excessive scanlines, retro green phosphor text)
- Excessive skeuomorphism that impedes usability

---

## 7. Agent Behavior

### Before Making Changes

- Read the relevant existing files before writing any code.
- Understand which components are actually used vs. which are currently unused (`EmailContent.tsx`, `ForensicPanel.tsx`, `SafetyScore.tsx`, `OriginInfo.tsx`, `EmailCard.tsx` are defined but not imported by any current page).
- Understand the data contract that will be passed to any component you create or modify.

### When Implementing

- Prefer modifying and extending existing components over rewriting them from scratch.
- Use semantic Tailwind CSS variable tokens (`bg-card`, `text-foreground`, `border-border`) — not hardcoded utility colors — so theme changes propagate correctly.
- Do not introduce new npm dependencies unless clearly justified by the task. State the justification when adding one.
- Do not create redundant component files that duplicate existing functionality.
- Fix lint errors introduced by your changes. Do not ignore `@typescript-eslint/no-explicit-any` or `react-hooks/*` violations.

### After Significant Changes

- Run `npx tsc --noEmit` to verify TypeScript correctness.
- Run `npm run lint` to check for ESLint errors and warnings.
- Run `npm run build` after any significant structural change to verify the Next.js build succeeds.
- Note any pre-existing lint warnings that were present before your changes to distinguish them from regressions.

### Do Not

- Modify unrelated files or components when implementing a focused task.
- Add `// eslint-disable` comments to suppress real errors — fix the root cause.
- Use `any` type without justification.
- Mutate module-level or prototype-level globals outside of `useEffect`.
- Access `params.id` directly in App Router pages — always await `params` first.
