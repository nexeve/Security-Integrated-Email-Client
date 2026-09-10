# Cyber Leek — Architecture Documentation

## 1. Project Purpose

**Cyber Leek** is a secure-by-design webmail client. Unlike traditional email security solutions that operate as external header analysis tools or mail upload services, Cyber Leek embeds automated cybersecurity analysis and digital forensics directly into the primary email interface.

Users interact with their mailbox naturally (browsing inbox folders, reading threads, sending messages) while security indicators, SPF/DKIM/DMARC authentication evaluations, spoofing detection, URL safety inspection, attachment auditing, and network relay forensics are computed continuously in the background.

---

## 2. Directory Structure

```
├── app/                           # Next.js 16 App Router pages, layouts, and API route handlers
│   ├── api/                       # Backend HTTP API endpoints
│   │   ├── auth/                  # Authentication endpoints (Google OAuth 2.0, session)
│   │   │   ├── google/            # /api/auth/google initiation & callback
│   │   │   ├── logout/            # /api/auth/logout
│   │   │   └── me/                # /api/auth/me session inspection
│   │   └── emails/                # Mailbox & email endpoints
│   │       ├── [id]/              # Individual message detail & actions
│   │       │   ├── action/        # /api/emails/[id]/action (star, read, trash)
│   │       │   └── route.ts       # /api/emails/[id] (full analysis with geo)
│   │       ├── send/              # /api/emails/send
│   │       └── route.ts           # /api/emails (fast list with skipGeo)
│   ├── email/                     # User-facing email reader pages
│   │   └── [id]/                  # Single email reader route
│   │       ├── analytics/         # Deep forensics & origin relay map page
│   │       └── page.tsx           # Email detail reader page
│   ├── login/                     # Login authentication screen
│   ├── globals.css                # Tailwind CSS v4 design tokens and atmospheric glass styles
│   ├── layout.tsx                 # Root layout with React Query provider & dark atmospheric theme
│   └── page.tsx                   # Primary inbox view (supports folder query param)
├── components/                    # Modular UI presentation layer
│   ├── analytics/                 # Deep forensic analytics views (Map, Origin, ThreatOverview, etc.)
│   ├── email-view/                # Message reading, header disclosure, and compose modal
│   ├── inbox/                     # Inbox list rows and message preview components
│   ├── layout/                    # Application shell (AppHeader, Sidebar, MainLayout)
│   ├── shared/                    # Reusable domain-neutral presentation widgets (AnalysisLoading)
│   ├── ui/                        # Reusable primitive controls (Base UI / Shadcn buttons, badges, cards)
│   └── providers.tsx              # Client React Query provider wrapper
├── docs/                          # Human-facing architectural and development documentation
│   ├── analysis-engine.md         # Forensic scoring and analyzer specifications
│   └── architecture.md            # Canonical system architecture document (this document)
├── lib/                           # Core application and domain infrastructure
│   ├── analysis/                  # Security analysis domain
│   │   ├── analyzers/             # Specialized heuristic analyzers (auth, identity, content, etc.)
│   │   ├── services/              # External provider boundaries (geolocation, threat intelligence)
│   │   ├── utils/                 # Domain normalization utilities (domain extraction, public suffix)
│   │   ├── engine.ts              # AnalysisEngine coordinator and result caching
│   │   ├── scoring.ts             # Correlated risk scoring and classification engine
│   │   └── types.ts               # Engine interfaces and analysis configuration
│   ├── api/                       # Client-side React Query data fetching hooks and mutations
│   │   └── emails.ts              # useEmails, useEmail, useEmailAction, useSendEmail
│   ├── auth/                      # Authentication and session handling
│   │   ├── google.ts              # Google OAuth 2.0 client & scopes configuration
│   │   └── session.ts             # Encrypted JWT session cookies using Jose
│   ├── gmail/                     # Gmail API integration domain
│   │   ├── client.ts              # Raw Gmail SDK calls, normalization, and MIME encoding
│   │   └── index.ts               # Canonical export of Gmail service operations
│   ├── types.ts                   # Canonical shared TypeScript data contracts
│   └── utils.ts                   # Shared UI utility helpers (cn)
├── tests/                         # Test suites organized by domain
│   └── analysis/                  # Security analysis domain tests
│       └── engine.test.ts         # Comprehensive deterministic engine & category test suite
├── public/                        # Static public assets
├── middleware.ts                  # Route guard checking session cookies
├── next.config.ts                 # Next.js framework configuration
├── package.json                   # Package manifests and scripts (dev, build, test, lint)
└── tsconfig.json                  # TypeScript compiler options and path aliases (@/*)
```

---

## 3. Responsibility of Each Major Directory

| Directory | Architectural Responsibility | Prohibited Patterns |
|---|---|---|
| `app/` | Routing, request dispatching, parameter parsing, HTTP status codes, and response orchestration. | Heavy business logic or direct provider integration inside route handlers. |
| `components/` | Presentational rendering, user interaction, animation, and responsive styling using semantic tokens. | Direct calls to Gmail SDK, raw geolocation fetches, or computing security scores inside components. |
| `lib/analysis/` | Pure security analysis, header interpretation, heuristic threat evaluation, scoring, and evidence package generation. | Importing React, UI hooks, Next.js server cookies, or Gmail SDK types. |
| `lib/gmail/` | Isolates all interactions with `googleapis` (Gmail v1). Normalizes raw RFC-822 / MIME payloads into standard `RawEmail`. | Leaking raw Google SDK types outside this module. |
| `lib/auth/` | OAuth 2.0 flow initialization, callback token exchange, and encrypted stateless JWT cookie storage. | Storing plain credentials or secrets in client-readable storage. |
| `lib/api/` | Client-side React Query query and mutation hooks providing cache management, optimistic updates, and invalidation. | Directly calling `fetch` outside of hook fetchers. |
| `tests/` | Automated unit, regression, and integration tests grouped by domain. | Testing mocks of mocks; tests must exercise real domain logic deterministically. |

---

## 4. Data Flow

The application follows a unidirectional, strictly typed data lifecycle:

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Page as React Component (Page)
    participant RQ as React Query (lib/api/emails.ts)
    participant API as Route Handler (app/api/emails)
    participant Gmail as Gmail Service (lib/gmail)
    participant Engine as Analysis Engine (lib/analysis)
    participant Google as Gmail API / Geo Providers

    User->>Page: Navigates to Mailbox or Email
    Page->>RQ: useEmails(folder) or useEmail(id)
    RQ->>API: GET /api/emails?folder=inbox or GET /api/emails/[id]
    API->>Gmail: listEmails(folder) or getEmail(id)
    Gmail->>Google: fetch messages via googleapis v1
    Google-->>Gmail: raw message payload
    Gmail-->>API: normalized RawEmail object
    API->>Engine: analyze(email, options)
    Note over Engine: Runs Auth, Identity, Content, URL, Attachment, Origin analyzers
    Engine-->>API: ExtendedAnalysisResult
    API-->>RQ: JSON response (EmailListItem[] or EmailDetailResponse)
    RQ-->>Page: Cached, reactive typed data
    Page-->>User: Renders dark atmospheric glass UI with verified security telemetry
```

### Analysis Workload Separation (Performance Guard)
- **Inbox Listing (`GET /api/emails?folder=...`)**: Invokes `analyze(email, { skipGeo: true })`. External network lookups for geolocation are bypassed entirely. Security indicators, authentication status, and safety scores compute synchronously in sub-milliseconds and results are saved to `lightCache`.
- **Detail & Forensics View (`GET /api/emails/[id]`)**: Invokes `analyze(email, { skipGeo: false })`. Public IPs are checked against the geolocation provider chain with a 3-second timeout and results are saved to `fullCache`.

---

## 5. Authentication Flow

Authentication is built with **Google OAuth 2.0** and stateless encrypted JWT session cookies (`jose`):

1. **Initiation (`/api/auth/google`)**: Generates a consent URL requesting scopes:
   - `openid`, `email`, `profile`
   - `https://www.googleapis.com/auth/gmail.readonly`
   - `https://www.googleapis.com/auth/gmail.send`
   - `https://www.googleapis.com/auth/gmail.modify`
2. **Callback (`/api/auth/google/callback`)**: Exchanges the authorization code for access and refresh tokens, extracts user profile information, encrypts a `SessionPayload` using AES-256/HS256 with `SESSION_SECRET`, and sets an `httpOnly`, `sameSite: 'lax'`, `secure` cookie named `cyber_leek_session`.
3. **Session Verification (`middleware.ts`)**: Inspects every incoming App Router request. If the cookie is absent or decrypt fails, requests to protected routes redirect to `/login`.
4. **Token Injection (`lib/gmail/client.ts`)**: `getGmailClient()` reads the session cookie, injects credentials into the OAuth2 client, and instantiates the `googleapis.gmail('v1')` SDK.

---

## 6. Gmail Integration Boundary

All interaction with Gmail is encapsulated within `lib/gmail/`:
- **Module Exports**:
  - `listEmails(folder, maxResults)`: Translates logical folders into Gmail search queries:
    - `inbox` -> `in:inbox -category:promotions -category:social -category:updates -category:forums` (Primary Inbox only)
    - `promotions` -> `category:promotions in:inbox`
    - `social` -> `category:social in:inbox`
    - `starred` -> `is:starred`
    - `sent` -> `in:sent`
    - `drafts` -> `is:draft`
    - `spam` -> `in:spam`
    - `trash` -> `in:trash`
  - `getEmail(id)`: Fetches full message payload by ID.
  - `sendEmail(to, subject, text)`: Encodes an RFC-2822 compliant message in base64url and submits to `users.messages.send`.
  - `modifyEmailLabels(id, addLabels, removeLabels)`: Modifies Gmail system labels (`STARRED`, `UNREAD`, `TRASH`).
- **Data Boundary**: The Gmail integration normalizes raw Gmail responses into `RawEmail`. No `googleapis` objects, tokens, or raw MIME structures escape `lib/gmail/`.

---

## 7. Analysis Engine Architecture

The analysis engine (`lib/analysis/engine.ts`) implements the `AnalysisEngine` interface:

```typescript
export interface AnalysisEngine {
  analyze(email: RawEmail, options?: AnalysisOptions): Promise<ExtendedAnalysisResult>;
}
```

The engine is **deterministic and evidence-based**:
- **Zero Hallucination**: No random values, synthetic mock indicators, or fabricated coordinates are ever generated.
- **Explainable Correlated Scoring**: `calculateCorrelatedScore()` aggregates threat indicators by category. Penalties are capped within each category to prevent artificial score collapse from multiple weak signals of the same underlying cause.
- **Decoupled Replaceability**: The UI and API routes interact only with `ExtendedAnalysisResult`. If the prototype heuristic engine is replaced with an ML or Python/FastAPI service in the future, the backend need only fulfill the `ExtendedAnalysisResult` schema.

---

## 8. Analyzer Responsibilities

The analysis domain is decomposed into single-responsibility analyzers under `lib/analysis/analyzers/`:

1. **Authentication (`authentication.ts`)**: Parses `Authentication-Results` and `DKIM-Signature` headers. Distinguishes missing authentication (`unknown`) from explicit failures (`fail`).
2. **Identity (`identity.ts`)**: Evaluates organizational domain alignment between `From`, `Reply-To`, and `Return-Path` using public suffix rules (`lib/analysis/utils/domain.ts`). Flags lookalike characters and deceptive display names without false-positive penalties on valid cross-subdomain bouncing.
3. **Content (`content.ts`)**: Detects actionable phishing behavior by correlating urgency semantics with sensitive credential or financial requests, avoiding crude single-keyword blocklists.
4. **URLs (`url.ts`)**: Extracts all URLs from HTML and plaintext bodies. Flags raw IP hostnames, embedded credentials (`http://user:pass@domain`), and deceptive subdomains.
5. **Attachments (`attachment.ts`)**: Identifies dangerous executable and script extensions (`.exe`, `.vbs`, `.scr`, `.bat`) and double-extension obfuscation (e.g. `invoice.pdf.exe`).
6. **Origin (`origin.ts`)**: Parses chronological `Received` headers to extract relay IP hops and isolates the earliest reliable public IP address.

---

## 9. Geolocation Boundary

The geolocation boundary (`lib/analysis/services/geolocation.ts`) resolves geographic coordinates for public mail relay hops:
- **Private IP Exclusion**: Addresses in RFC 1918 (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`), loopback (`127.0.0.0/8`, `::1`), link-local (`169.254.0.0/16`, `fe80::/10`), and IPv6 ULA (`fc00::/7`) are rejected immediately before any network call.
- **Provider Chain**: Tries `ip-api.com` (primary) then falls back to `ipapi.co` (secondary HTTPS). Each query is guarded with an `AbortController` timeout of 3,000 ms.
- **In-Memory Cache**: Results are keyed by IP address in a server-side cache so multiple emails from the same mail server do not trigger redundant provider requests.
- **Honest Absence**: If lookups fail or providers are unreachable, `latitude` and `longitude` remain `undefined`, and `country` is set to `'Unavailable'`. The Leaflet map component displays a clean "No geographic data" placeholder rather than fabricating coordinates.

---

## 10. Threat Intelligence Boundary

URL threat intelligence is isolated behind the `ThreatIntelProvider` interface (`lib/analysis/services/threat-intel.ts`):
- `VoidThreatIntelProvider`: Default fallback returning `reputation: 'unknown'` when no external API key is configured.
- `GoogleSafeBrowsingProvider`: Skeleton for Google Safe Browsing Lookup API v4, activated when `SAFE_BROWSING_API_KEY` is present.
- UI components and analyzers never communicate with threat intelligence APIs directly.

---

## 11. API Architecture

All routes live under `app/api/` and adhere to Next.js 16 App Router conventions:

| Endpoint | Method | Purpose | Key Query/Body Parameters |
|---|---|---|---|
| `/api/auth/google` | GET | Initiates OAuth flow | None |
| `/api/auth/google/callback` | GET | Handles OAuth redirect | `code`, `state` |
| `/api/auth/logout` | POST | Clears session cookie | None |
| `/api/auth/me` | GET | Returns active session user | None |
| `/api/emails` | GET | Lists emails for a folder | `?folder=inbox\|promotions\|social...` |
| `/api/emails/[id]` | GET | Full email details & forensics | Dynamic route parameter `id` |
| `/api/emails/[id]/action` | POST | Performs star, read, trash, archive | `{ action: 'star'\|'read'\|... }` |
| `/api/emails/send` | POST | Composes and sends email | `{ to, subject, text }` |

Constraints:
- Route parameters (`params`) are asynchronous in Next.js 16: `const { id } = await params;`.
- Route handlers return standard `NextResponse.json(...)` objects with explicit HTTP status codes.

---

## 12. UI & Component Architecture

Components live under `components/` and are grouped by product domain:

- **Layout (`components/layout/`)**:
  - `MainLayout.tsx`: Atmospheric shell container with persistent sidebar and header.
  - `AppHeader.tsx`: Search bar, current view indicator, user profile avatar, and logout button.
  - `Sidebar.tsx`: Navigation across mailboxes (`Inbox`, `Starred`, `Sent`, `Drafts`, `Promotions`, `Social`, `Spam`, `Trash`), unread badges, and live Security Telemetry HUD.
- **Inbox (`components/inbox/`)**:
  - `EmailRow.tsx`: High-density inbox row featuring sender, subject, date, unread dot, star toggle, and color-coded safety score badge.
- **Email Reader (`components/email-view/`)**:
  - `EmailView.tsx`: Full message reader with action toolbar (Reply, Forward, Archive, Trash), attachment chips, and embedded security summaries.
  - `EmailHtmlContent.tsx`: Isolated, DOMPurified iframe/HTML container preventing CSS bleeding and script execution.
  - `SafetyScoreBadge.tsx`: Visual badge with micro-gauge score and link to deep analytics.
  - `SecurityChecks.tsx`: SPF, DKIM, and DMARC protocol pass/fail indicators.
  - `ThreatIndicators.tsx`: Accordion list of explainable threat indicators with evidence.
  - `ComposeModal.tsx`: Tactile modal window for composing and dispatching messages.
- **Analytics (`components/analytics/`)**:
  - `SecurityAnalytics.tsx`: Master forensic dashboard orchestrator.
  - `ThreatOverview.tsx`: Risk verdict, attack classification, and threat meter.
  - `OriginRelayAnalysis.tsx` & `MapComponent.tsx`: Chronological hop timeline and interactive Leaflet dark-mode map.
  - `AIInvestigation.tsx`: Forensic assessment summary, key evidence list, and remediation guidance.
  - `URLIntelligence.tsx`: Extracted links table with domain reputation and risk ratings.
  - `EvidencePackage.tsx`: Incident snapshot export panel supporting JSON download.
- **Shared Primitives (`components/ui/` & `components/shared/`)**:
  - `AnalysisLoading.tsx`: Multi-stage animated security progress indicator.
  - `button.tsx`, `badge.tsx`, `card.tsx`: Base UI / Shadcn design primitives.

### Visual Design System
- **Theme**: Dark Atmospheric Glass — deep blue-charcoal base (`--background: oklch(0.090 0.025 258)`), translucent frosted glass surfaces (`--surface-1`, `--surface-2`), and cyan accent illumination (`--accent-cyan: oklch(0.720 0.140 200)`).
- **Strict Token Usage**: Never use hardcoded Tailwind palette colors (e.g. `text-red-500`, `bg-gray-100`). Always use semantic CSS variable tokens (`var(--safe)`, `var(--warning)`, `var(--danger)`, `var(--foreground)`, `var(--muted-foreground)`).

---

## 13. Type Ownership

The canonical type system is split into two clear boundaries:

1. **`lib/types.ts`**: Canonical application-wide domain data models:
   - `RawEmail`, `EmailHeaders`, `EmailSender`, `EmailRecipient`, `EmailAttachment`
   - `AnalysisResult`, `ExtendedAnalysisResult`
   - `ThreatIndicator`, `SecurityCheckResult`, `ScoreFactor`, `ForensicInfo`
   - `ThreatOverview`, `OriginAnalysis`, `RelayHop`, `AIInvestigation`, `URLIntelligenceItem`, `EvidencePackage`
2. **`lib/analysis/types.ts`**: Analysis engine contract interfaces:
   - `AnalysisEngine`, `AnalysisOptions`, `AnalysisConfig`

Rule: Never declare competing local interfaces for email entities or analysis structures inside components. Always import from `@/lib/types`.

---

## 14. Testing Strategy

- **Test Runner**: Configured in `package.json` as `npm test` using `jiti tests/analysis/engine.test.ts`. Runs instantly without external dependencies or network access.
- **Coverage Domains**:
  - **Category Separation**: Verifies primary Inbox queries exclude category mail (`CAT-1` through `CAT-8`).
  - **IP Classification**: Verifies RFC 1918, loopback, and ULA IP detection (`T11` through `T16`, `GEO-9`).
  - **Analysis Determinism**: Verifies identical email inputs produce identical results with stable references (`T17`, `PERF-17`).
  - **Honest Absence**: Verifies provider failures return `undefined` coordinates without throwing (`GEO-10`, `GEO-13`, `GEO-14`).
  - **Performance Guarantees**: Verifies `skipGeo: true` executes in 0 ms without external network requests (`PERF-16`).
- **Validation Suite**: Every change must pass:
  ```bash
  npm test
  npm run lint
  npx tsc --noEmit
  npm run build
  ```

---

## 15. Important Architectural Constraints

1. **Next.js 16 Asynchronous Route Parameters**: Dynamic segment parameters (`params`) in App Router routes are Promises. Always await them: `const { id } = await params;`.
2. **Leaflet Client-Only Guard**: Leaflet accesses the browser `window` object and must never be rendered on the server. Always import map components using `next/dynamic` with `{ ssr: false }`.
3. **Tailwind CSS v4 Compatibility**: Uses `@tailwindcss/postcss` with `@theme inline` in `globals.css`. Do not create a `tailwind.config.js` or introduce Tailwind v3 configuration conventions.
4. **React 19 Immutability**: Do not mutate objects outside component scope or monkey-patch library prototypes.
5. **No Synthetic Security Data**: Never fabricate threat scores, fake phishing indicators, or fake geographic coordinates.

---

## 16. Rules for Adding Future Features

1. **New Security Analyzers**:
   - Create `lib/analysis/analyzers/<analyzer-name>.ts`.
   - Implement pure functions that take `RawEmail` and return findings or `ThreatIndicator[]`.
   - Register the analyzer in `lib/analysis/engine.ts`.
   - Add deterministic unit tests in `tests/analysis/engine.test.ts`.
2. **New Mailbox Categories or Folders**:
   - Define query filter in `lib/gmail/client.ts`.
   - Add nav item in `components/layout/Sidebar.tsx`.
   - Add unread count query and include in optimistic cache mutations in `lib/api/emails.ts`.
3. **New External Intelligence Providers**:
   - Implement `ThreatIntelProvider` in `lib/analysis/services/threat-intel.ts` or `GeolocationProvider` in `lib/analysis/services/geolocation.ts`.
   - Add timeout bounds (`AbortController`) and fallback to `Unavailable`.

---

## 17. Examples of Correct vs Incorrect Dependency Direction

### Correct Dependency Direction:
```
UI Component (components/analytics/ThreatOverview.tsx)
  └── imports types from '@/lib/types'
  └── receives typed `overview: ThreatOverview` as prop
  └── renders UI using semantic CSS variables
```

### Incorrect Dependency Direction:
```
UI Component (components/analytics/ThreatOverview.tsx)
  └── imports analyzeContent from '@/lib/analysis/analyzers/content'  ❌ (UI directly running analyzers)
  └── calls fetch('https://ip-api.com/json/...')                     ❌ (UI calling external geo API)
  └── imports google from 'googleapis'                              ❌ (UI reaching into Gmail SDK)
  └── uses hardcoded 'text-red-500' instead of 'var(--danger)'      ❌ (violates design tokens)
```
