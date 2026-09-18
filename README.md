# 🛡️ CyberSec Portfolio — Full-Stack Angular Application

**Sumit Jaiswal | Cybersecurity Specialist & Ethical Hacker**

---

## 📖 12. Clear Explanation: Problem → Solution → Implementation → Result

* **Problem**: Traditional cybersecurity portfolios are often static pages that fail to demonstrate actual technical competency, secure coding practices, or dynamic data handling. Furthermore, managing project entries manually requires codebase edits.
* **Solution**: A dynamic, full-stack cybersecurity portfolio application that features role-based access control (Admin/Owner mode), real-time database management, and a secure backend infrastructure to highlight both offensive security knowledge and defensive software engineering.
* **Implementation**: Built as a Single Page Application (SPA) using Angular 17. The frontend is powered by Angular Signals and Router. The backend leverages Firebase for Serverless Auth, Firestore Database, and Security Rules. Deployment is automated via Netlify.
* **Result**: A highly secure, responsive, and easily manageable portfolio that not only lists achievements but actively proves full-stack software development and security architecture skills.

---

## 🏗️ 9. Architecture Diagram

```text
                         INTERNET
                            │
                            ▼
                    ┌──────────────┐
                    │   Netlify    │
                    │ HTTPS + CSP  │
                    └──────┬───────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │   Angular 17    │
                  │   TypeScript    │
                  └───────┬─────────┘
                          │
             ┌────────────┼─────────────┐
             │            │             │
             ▼            ▼             ▼
        Firebase       App Check    Security
          Auth                       Headers
             │
             ▼
       Firestore Rules
             │
      ┌──────┴──────┐
      ▼             ▼
 Public Data     Admin Data

             │
             ▼
      Firebase Storage
       Resume/Files

GitHub
  │
  ├── GitHub Actions
  ├── CodeQL
  ├── Dependabot
  ├── Secret Scanning
  └── Playwright
```

---

## 💻 10. Tech Stack

### 4. Frontend
- **Framework**: Angular 17 (Standalone Components)
- **State Management**: Angular Signals & RxJS BehaviorSubjects
- **Styling**: Pure CSS3 with dynamic CSS Variables for theming
- **Animations**: HTML5 Canvas (Matrix rain), CSS Keyframes

### 1. Authentication & 2. Database & 3. API
- **Auth**: Firebase Authentication (Role-based access via custom logic/terminal auth)
- **Database**: Cloud Firestore (Real-time NoSQL document database)
- **API**: Firebase Client SDKs (acts as BaaS backend API layer)

### 5. Deployment
- **Hosting**: Netlify
- **CI/CD**: Netlify continuous deployment from GitHub main branch
- **Routing**: Client-side routing with Netlify `_redirects` fallback

---

## 🛡️ Security Engineering & Architecture

This portfolio is engineered with a **Security-First** mindset, moving beyond standard frontend templates by incorporating robust cloud-security controls, automated static analysis, and zero-trust data handling:

* **Static Application Security Testing (SAST):** Automated **GitHub CodeQL** workflows analyze code semantics on every push to detect vulnerabilities early.
* **Supply Chain Security:** Automated `npm audit` and dependency vetting integrated directly into the CI/CD pipeline.
* **Zero-Trust Access Control:** Admin verification relies on **Firebase Custom Claims (`admin: true`)** and **Email Verification** enforced strictly at the database level via **Firestore & Storage Security Rules**.
* **Defense-in-Depth:** 
  * Strict **Content Security Policy (CSP)** and security headers (`X-Frame-Options`, `HSTS`, `Referrer-Policy`) deployed via Netlify configuration.
  * XSS mitigation via strict input handling, explicit URL scheme validation (`SafeUrlPipe`), and the complete elimination of raw DOM-injection sinks (`document.write`).
  * Prevention of Reverse Tabnabbing using enforced `rel="noopener noreferrer"` on dynamic external links.
* **Bot & Quota Abuse Protection:** Integration-ready with **Firebase App Check** (reCAPTCHA v3) to block automated script scraping.

---

## ⚠️ 6. Error Handling & 7. Tests

- **Error Handling**: Implemented globally. Failed API calls (e.g., unauthorized Firestore writes) are caught and displayed via UI toast notifications/error states rather than console crashes.
- **Tests**: The project structure is configured for Jasmine/Karma unit testing (Angular defaults). *Note: Comprehensive e2e testing (Cypress) and backend mocking are planned for the next iteration.*

---

## 🚀 13. Documentation & Setup

### Local Development

1. **Clone & Install**
   ```bash
   git clone https://github.com/Sumitjaiswal4839/My-portfolio-
   cd cybersec-portfolio
   npm install
   ```

2. **Environment Setup**
   Configure your Firebase environment in `src/environments/environment.ts`.

3. **Serve**
   ```bash
   ng serve
   ```
   Open `http://localhost:4200`

### Admin (Owner) Access
To access the **Protected Admin Surface** to add or modify projects:
1. Press `Alt + C + V` anywhere on the page to open the hidden admin login terminal.
2. Authenticate securely using **Firebase Authentication**.
3. Once authenticated, **Firestore Security Rules** and **Admin Authorization** (via Custom Claims) are verified. The secure admin controls (like "Add Project", "Delete", "Upload Resume") will then automatically mount to the DOM.

---
