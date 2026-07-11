
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
