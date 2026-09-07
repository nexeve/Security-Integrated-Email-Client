# \U0001f6e1\ufe0f Email Threat Detection & Forensics Platform

> **AI-powered email threat detection, geolocation and forensic intelligence platform**

An intelligent email security platform designed to **detect, investigate, analyze, and explain suspicious or malicious emails**.

The system combines email header forensics, authentication analysis, relay-path reconstruction, URL intelligence, reputation analysis, social-engineering detection, geolocation, deterministic risk scoring, and AI-assisted investigation into a unified workflow.

> \U0001f680 Developed as an **MVP for Smart India Hackathon (SIH)**.

---

## \U0001f4cc Overview

Email is one of the most common attack vectors used for:

* Phishing
* Credential theft
* Business Email Compromise (BEC)
* Sender impersonation
* Malware delivery
* Financial fraud
* Social engineering

Investigating a suspicious email manually can require inspecting raw headers, authentication results, IP addresses, relay servers, URLs, domains, attachments, and message content.

This project aims to turn that process into a **structured, automated, and explainable investigation pipeline**.

### Core Workflow

```text
                  \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510
                  \u2502    .EML Input    \u2502
                  \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518
                           \u2502
                           \u25bc
                \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510
                \u2502 Email Parsing &     \u2502
                \u2502 Header Extraction   \u2502
                \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518
                           \u2502
             \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u253c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510
             \u25bc             \u25bc             \u25bc
      \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510 \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510 \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510
      \u2502 Header &   \u2502 \u2502 URL /      \u2502 \u2502 Sender &   \u2502
      \u2502 Auth       \u2502 \u2502 Domain     \u2502 \u2502 IP Intel   \u2502
      \u2502 Analysis   \u2502 \u2502 Analysis   \u2502 \u2502 & Geo      \u2502
      \u2514\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2518 \u2514\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2518 \u2514\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2518
            \u2502              \u2502              \u2502
            \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u253c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518
                           \u25bc
                 \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510
                 \u2502 Threat Indicators \u2502
                 \u2502 & Risk Scoring    \u2502
                 \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518
                          \u2502
                          \u25bc
                 \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510
                 \u2502 AI-Assisted      \u2502
                 \u2502 Investigation     \u2502
                 \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518
                          \u2502
                          \u25bc
                 \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510
                 \u2502 Investigation    \u2502
                 \u2502 Dashboard        \u2502
                 \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518
```

---

## \U0001f3af Objectives

The platform is designed to:

1. **Detect** potentially malicious emails.
2. **Analyze** technical email metadata and headers.
3. **Identify** suspicious URLs, domains, and IP addresses.
4. **Reconstruct** the email's relay path.
5. **Determine** geographical information associated with infrastructure.
6. **Identify** social-engineering indicators.
7. **Calculate** an explainable threat/risk score.
8. **Assist investigators** in understanding why an email is suspicious.
9. **Present findings** through a centralized investigation dashboard.

---

## \U0001f50d Key Features

### \U0001f4e7 Email Forensics

Analyze `.eml` files and extract relevant forensic information, including:

* Sender information
* Recipient information
* Subject
* Message headers
* `Received` headers
* IP addresses
* Domains
* URLs
* Authentication results

### \U0001f510 Authentication Analysis

Inspect available email authentication information such as:

* SPF
* DKIM
* DMARC
* Authentication results
* Sender-domain inconsistencies

Authentication failures can be used as supporting indicators during threat analysis.

### \U0001f310 Relay-Path Reconstruction

Reconstruct the route an email took through intermediary mail servers using its `Received` headers.

This helps investigators identify:

* Originating infrastructure
* Intermediate mail servers
* Suspicious relay patterns
* IP addresses associated with the message

### \U0001f30d IP Geolocation

Extract relevant IP addresses and associate them with geographical and network information.

Potential investigation data includes:

* Country
* Region
* City
* ISP / organization
* Autonomous System information
* Approximate geographical location

> Geolocation is treated as an investigative indicator rather than definitive proof of an attacker's physical location.

### \U0001f517 URL & Domain Intelligence

Extract URLs and domains from email content and analyze them for suspicious characteristics.

Potential indicators include:

* Suspicious domains
* URL redirection
* Domain reputation
* Newly observed infrastructure
* Look-alike domains
* Suspicious URL structures

### \U0001f9e0 Social-Engineering Detection

Analyze email content for patterns commonly associated with social engineering, including:

* Urgency
* Fear or intimidation
* Credential requests
* Financial requests
* Impersonation
* Suspicious calls to action
* Unusual language patterns

### \U0001f4ca Threat & Risk Scoring

Combine multiple indicators into a structured risk assessment.

Example indicators:

```text
Email Authentication
        +
Sender Reputation
        +
IP Reputation
        +
Geolocation
        +
URL Intelligence
        +
Social Engineering
        +
Header Anomalies
        \u2193
   Risk Assessment
```

The goal is not simply to label an email as *malicious* or *safe*, but to provide investigators with an **explainable basis for the assessment**.

### \U0001f916 AI-Assisted Investigation

AI can assist investigators by:

* Summarizing technical findings
* Explaining suspicious indicators
* Connecting multiple observations
* Providing an investigation-oriented interpretation
* Producing human-readable threat explanations

AI output should complement deterministic security analysis rather than replace verifiable forensic evidence.

---

## \U0001f5a5\ufe0f Dashboard

The platform is intended to provide a centralized investigation interface containing information such as:

| Section            | Purpose                        |
| ------------------ | ------------------------------ |
| Email Overview     | Basic message information      |
| Threat Score       | Overall risk assessment        |
| Authentication     | SPF/DKIM/DMARC findings        |
| Header Analysis    | Important header anomalies     |
| Relay Path         | Email infrastructure route     |
| IP Intelligence    | IP reputation and geolocation  |
| URL Intelligence   | Suspicious links and domains   |
| Social Engineering | Behavioral/content indicators  |
| AI Investigation   | Human-readable analysis        |
| Evidence           | Supporting forensic indicators |

---

## \U0001f9e9 Investigation Philosophy

The system follows a **defense-in-depth** approach.

No single indicator should automatically determine whether an email is malicious.

Instead, multiple signals are correlated:

```text
                 \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510
                 \u2502 Email Header \u2502
                 \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518
                        \u2502
       \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u253c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510
       \u25bc                \u25bc                \u25bc
 Authentication    Infrastructure     Content
       \u2502                \u2502                \u2502
       \u25bc                \u25bc                \u25bc
 SPF/DKIM/DMARC    IP / Domain       Social Engineering
       \u2502                \u2502                \u2502
       \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u253c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518
                        \u25bc
                 \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510
                 \u2502 Correlation  \u2502
                 \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518
                        \u25bc
                 \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510
                 \u2502 Risk Score   \u2502
                 \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518
                        \u25bc
                 \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510
                 \u2502 Investigation\u2502
                 \u2502   Result     \u2502
                 \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518
```

This makes the resulting assessment more explainable and useful for forensic investigation.

---

## \U0001f6e0\ufe0f Technology

The repository is currently primarily a **Python** project.

The implementation is expected to evolve as the MVP develops.

### Current / Planned Components

* **Python** \u2014 Core analysis and processing
* **Email / MIME parsing** \u2014 `.eml` processing
* **Threat intelligence** \u2014 Reputation and indicator enrichment
* **IP geolocation** \u2014 Infrastructure intelligence
* **AI / NLP** \u2014 Investigation assistance
* **Web dashboard** \u2014 Visualization and investigation workflow

> Specific libraries and external services should be added here as they become part of the implemented stack.

---

## \U0001f4e5 Input

The primary investigation input is an email file in `.eml` format:

```text
email.eml
```

The system parses the message and extracts the relevant forensic artifacts before analysis.

---

## \U0001f4e4 Output

An investigation produces structured findings such as:

```text
Email
 \u251c\u2500\u2500 Sender
 \u251c\u2500\u2500 Recipient
 \u251c\u2500\u2500 Subject
 \u251c\u2500\u2500 Authentication
 \u2502    \u251c\u2500\u2500 SPF
 \u2502    \u251c\u2500\u2500 DKIM
 \u2502    \u2514\u2500\u2500 DMARC
 \u2502
 \u251c\u2500\u2500 Header Analysis
 \u2502    \u2514\u2500\u2500 Anomalies
 \u2502
 \u251c\u2500\u2500 Relay Path
 \u2502    \u251c\u2500\u2500 IP addresses
 \u2502    \u2514\u2500\u2500 Mail servers
 \u2502
 \u251c\u2500\u2500 IP Intelligence
 \u2502    \u251c\u2500\u2500 Reputation
 \u2502    \u2514\u2500\u2500 Geolocation
 \u2502
 \u251c\u2500\u2500 URL Intelligence
 \u2502    \u251c\u2500\u2500 Domains
 \u2502    \u2514\u2500\u2500 Suspicious URLs
 \u2502
 \u251c\u2500\u2500 Social Engineering
 \u2502    \u2514\u2500\u2500 Detected Indicators
 \u2502
 \u2514\u2500\u2500 Final Risk Assessment
      \u251c\u2500\u2500 Risk Score
      \u251c\u2500\u2500 Severity
      \u2514\u2500\u2500 Explanation
```

---

## \U0001f6a7 Project Status

**Status: MVP / Active Development**

The project is being developed as a Smart India Hackathon solution and is expected to evolve through multiple development stages.

### Planned Development

* [ ] Complete `.eml` parsing pipeline
* [ ] Header forensic analysis
* [ ] SPF/DKIM/DMARC analysis
* [ ] Relay-path visualization
* [ ] IP geolocation
* [ ] URL/domain intelligence
* [ ] Threat-intelligence integration
* [ ] Social-engineering detection
* [ ] Deterministic risk-scoring engine
* [ ] AI-assisted investigation
* [ ] Investigation dashboard
* [ ] Evidence/report generation
* [ ] End-to-end testing
* [ ] Deployment

---

## \U0001f512 Security & Privacy

Email files may contain sensitive information.

When using this platform:

* Do not upload confidential emails to untrusted infrastructure.
* Do not expose API keys or credentials in source code.
* Use environment variables for secrets.
* Sanitize sensitive information before sharing investigation results.
* Treat third-party threat-intelligence services as external data processors.
* Do not consider automated analysis alone as definitive attribution.

---

## \u26a0\ufe0f Limitations

The platform is an investigative aid, not an absolute source of attribution.

In particular:

* IP geolocation is approximate.
* Email headers can be manipulated or incomplete.
* Authentication results depend on the mail infrastructure.
* Reputation databases may contain false positives or false negatives.
* AI-generated explanations may require analyst verification.
* A high risk score does not independently prove malicious intent.

Human investigation and corroborating evidence remain important for high-impact decisions.

---

## \U0001f3d7\ufe0f Project Architecture

At a high level:

```text
                    \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510
                    \u2502   .EML Upload   \u2502
                    \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518
                             \u2502
                             \u25bc
                    \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510
                    \u2502 Email Parser    \u2502
                    \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518
                             \u2502
                             \u25bc
                    \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510
                    \u2502 Feature / IOC    \u2502
                    \u2502 Extraction       \u2502
                    \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518
                             \u2502
             \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u253c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510
             \u25bc               \u25bc               \u25bc
        Header/Auth      URL/Domain       IP/Geo
         Analysis        Intelligence    Intelligence
             \u2502               \u2502               \u2502
             \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u253c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518
                             \u25bc
                    \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510
                    \u2502 Risk Engine     \u2502
                    \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518
                             \u2502
                             \u25bc
                    \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510
                    \u2502 AI Investigation\u2502
                    \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518
                             \u2502
                             \u25bc
                    \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510
                    \u2502 Dashboard /     \u2502
                    \u2502 Report          \u2502
                    \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518
```

---

## \U0001f680 Getting Started

Clone the repository:

```bash
git clone https://github.com/K1LL-Sw1tch07/Email-threat-detection.git
cd Email-threat-detection
```

Create a virtual environment:

```bash
python -m venv .venv
```

Activate it on Linux/macOS:

```bash
source .venv/bin/activate
```

Activate it on Windows:

```powershell
.venv\Scripts\activate
```

Install project dependencies once `requirements.txt` is configured:

```bash
pip install -r requirements.txt
```

Then follow the project-specific setup instructions for the configured services and dashboard.

---

## \U0001f91d Contributing

Contributions are welcome as the project develops.

Recommended workflow:

```text
Create Branch
     \u2193
Implement Feature
     \u2193
Test
     \u2193
Commit
     \u2193
Pull Request
     \u2193
Review
     \u2193
Merge
```

For significant architectural changes, discuss the approach with the team before implementation.

---

## \U0001f4da Project Context

This project was developed as part of **Smart India Hackathon (SIH)** and focuses on the problem of AI-powered email threat detection, geolocation, and forensic intelligence.

The repository serves as the central codebase for the team's implementation and experimentation.

---

## \U0001f4c4 License

License information will be added when the project license is finalized.

---

## \U0001f465 Team

**SIH Team \u2014 Email Threat Detection & Forensics**

Built for **Smart India Hackathon**.
