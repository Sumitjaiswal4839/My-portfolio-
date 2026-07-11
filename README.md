# 🔐 SECURITY: Owner-Only Admin Access

This portfolio uses a **secret terminal authentication system** to protect admin features (upload resume, add content, etc.).

## 🔓 How to Unlock Owner Features

**For Owner Only:**
1. Press the **backtick key (`)** **three times rapidly** — ` ` `
2. A hidden terminal will appear
3. Type: `REDACTED` and press **Enter**
4. You'll see: **"✓ Authentication Successful — Admin Mode Activated"**
5. Admin badge appears bottom-right: **👑 OWNER MODE**

**How to Logout:**
- Click the **"Logout"** button on the admin badge

## 🛡️ What's Protected?

All buttons with `*adminOnly` directive are hidden from regular users:
- Upload Resume button
- Add Projects button
- Edit Content button
- Any future admin features

```html
<!-- Use this in templates for protected buttons -->
<button *adminOnly (click)="uploadResume()">Upload Resume</button>
```

## 🔧 Implementation for New Buttons

When adding new admin buttons in **future components**, follow this pattern:

### In your component TypeScript:
```typescript
import { AdminService } from './services/admin.service';
import { AdminOnlyDirective } from './directives/admin-only.directive';

@Component({
  imports: [AdminOnlyDirective, ...],
  // ...
})
export class YourComponent {
  constructor(public adminService: AdminService) {}
}
```

### In your component template:
```html
<!-- Button only visible when admin is authenticated -->
<button *adminOnly (click)="yourAction()">
  🔓 Admin Action
</button>

<!-- Optional: Show admin-only content -->
<div *adminOnly class="admin-panel">
  <!-- admin-only content -->
</div>
```

## 📋 How It Works

| Feature | Detail |
|---------|--------|
| **Trigger** | Press backtick (`) three times: ` ` ` |
| **Password** | `REDACTED` |
| **Session** | Persists until tab is closed |
| **Visibility** | Elements completely removed from DOM (not just hidden) |
| **Status** | Admin indicator shows when logged in |

## 📝 Checklist for Future Updates

- ✅ Import `AdminOnlyDirective` in component
- ✅ Inject `AdminService` in constructor
- ✅ Wrap buttons with `*adminOnly` directive
- ✅ Test by pressing ` ` ` and typing `REDACTED`

---

# 🛡️ CyberSec Portfolio — Angular Project

**Sumit Jaiswal | Cybersecurity Specialist & Ethical Hacker**

This is a full Angular 17 (Standalone Components) conversion of the original HTML/CSS/JS portfolio files.

---

## 📁 Project Structure

```
cybersec-portfolio/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── navbar/           ← Navbar + sub-navbar + social links (fixed)
│   │   │   ├── hero/             ← Home page + quick skills grid
│   │   │   ├── skills/           ← Full skills page with tab switching
│   │   │   ├── contact/          ← Contact form + info cards
│   │   │   └── matrix-bg/        ← Animated matrix rain (canvas)
│   │   ├── services/
│   │   │   └── theme.service.ts  ← Dark/light theme toggle service
│   │   ├── app.component.ts      ← Root component
│   │   ├── app.config.ts         ← Bootstrap config
│   │   └── app.routes.ts         ← Routing (/, /skills, /contact)
│   ├── index.html
│   ├── main.ts
│   └── styles.css                ← Global CSS variables & shared styles
├── angular.json
├── package.json
├── tsconfig.json
└── tsconfig.app.json
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd cybersec-portfolio
npm install
```

### 2. Run Development Server
```bash
ng serve
# or
npm start
```
Open: **http://localhost:4200**

### 3. Build for Production
```bash
ng build
```
Output goes to `dist/cybersec-portfolio/`

---

## 🗺️ Pages & Routes

| Route      | Component           | Description                     |
|------------|---------------------|---------------------------------|
| `/`        | `HeroComponent`     | Landing page + expertise cards  |
| `/skills`  | `SkillsComponent`   | Full skills with tab switching  |
| `/contact` | `ContactComponent`  | Contact form + info             |

---

## ✨ Features

- ✅ **Matrix rain** background (canvas, Angular component)
- ✅ **Dark/Light theme toggle** via ThemeService (Angular Signal)
- ✅ **Responsive navbar** with mobile hamburger menu
- ✅ **Fixed social links** sidebar
- ✅ **Tab-switching skills** (Core Skills / Cybersecurity)
- ✅ **Animated progress bars** for skill levels
- ✅ **Contact form** with reactive feedback (submit spinner + success state)
- ✅ **Angular Router** — SPA navigation between pages
- ✅ **Angular Signals** for state management

---

## 🎨 Theme Customization

Edit CSS variables in `src/styles.css`:

```css
:root {
  --primary: #00ff41;   /* Matrix green */
  --accent:  #00d4ff;   /* Cyan blue */
  --bg-primary: #050714;
}
```

---

## 📦 Source Files Converted

| Original File   | Angular Component              |
|-----------------|-------------------------------|
| `index1.html`   | `HeroComponent` (base layout) |
| `index2.html`   | `HeroComponent` (skills grid) |
| `index3.html`   | Structure reference           |
| `index4.html`   | `NavbarComponent` (sub-nav)   |
| `index5.html`   | `SkillsComponent` (tabs/badges)|
| `index6.html`   | `ContactComponent` + SPA router|
| `skill.html`    | `SkillsComponent`             |
| `Contact.html`  | `ContactComponent`            |
# My-portfolio-
