import { Component, OnInit, OnDestroy, ViewChild, ElementRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../../services/data.service';
import { AdminService } from '../../../services/admin.service';
import { openSafeExternalLink } from '../../../core/utils/safe-url';
import { openFileSafely } from '../../../utils/safe-open';
import { AnalyticsService } from '../../../core/services/analytics.service';

interface EngineeringHighlight {
  icon: string;
  title: string;
  description: string;
  technologies: string[];
}

@Component({
  selector: 'app-sde-hero',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="sde-hero-container">
      <div class="hero-grid">
        <div class="hero-content">
          <div class="badge-sde">
            <i class="fas fa-terminal"></i> SOFTWARE DEVELOPMENT ENGINEER
          </div>
          <h1 class="hero-title">
            Building <span class="highlight typing-highlight">{{ currentTypedText() }}</span><span class="typing-cursor" aria-hidden="true">|</span> That People Can Use
          </h1>
          <p class="hero-description">
            Hi, I'm <strong class="text-white">Sumit Jaiswal</strong>. A passionate Full-Stack Developer specializing in high-performance web applications, distributed systems, clean architectures, modern UI/UX engineering, and secure database &amp; backend systems.
          </p>
          
          <div class="hero-actions">
            <a routerLink="/sde/projects" class="btn btn-sde-primary">
              <i class="fas fa-code-branch"></i> View Engineering Projects
            </a>
            <a routerLink="/sde/skills" class="btn btn-sde-secondary">
              <i class="fas fa-layer-group"></i> Tech Stack &amp; Skills
            </a>

            <!-- Resume Split Button / Dropdown -->
            <div class="resume-wrapper">
              <div class="btn btn-sde-outline btn-split">
                <div class="btn-split-main" (click)="downloadResume()" title="Download / View Resume">
                  <i class="fas fa-file-download"></i> Resume
                </div>
                <div class="btn-split-divider" *ngIf="adminService.isAdmin$ | async"></div>
                <div class="btn-split-icon" (click)="toggleDropdown()" title="Admin Resume Options" *ngIf="adminService.isAdmin$ | async">
                  <i class="fas fa-ellipsis-v"></i>
                </div>
              </div>

              <!-- Dropdown Menu (Admin Only) -->
              <div class="resume-dropdown" *ngIf="dropdownOpen && (adminService.isAdmin$ | async)">
                <button (click)="triggerUpload()">
                  <i class="fas fa-upload"></i> Upload PDF
                </button>
                <button (click)="previewResume()" [disabled]="!resumeUrl" [class.disabled]="!resumeUrl">
                  <i class="fas fa-eye"></i> Preview
                </button>
                <button (click)="deleteResume()" [disabled]="!resumeUrl" [class.disabled]="!resumeUrl" class="delete-btn">
                  <i class="fas fa-trash"></i> Delete
                </button>
              </div>
              
              <!-- Hidden File Input -->
              <input type="file" #fileInput (change)="onFileSelected($event)" accept="application/pdf" style="display: none;">
            </div>

            <!-- Preview button for visitors when resume exists -->
            <button class="btn btn-sde-secondary" *ngIf="resumeUrl" (click)="previewResume()" title="Preview Resume in New Tab">
              <i class="fas fa-eye"></i> Preview
            </button>
          </div>

          <div class="tech-ticker">
            <span class="ticker-label">Core Stack:</span>
            <span class="ticker-tag">TypeScript</span>
            <span class="ticker-tag">Angular</span>
            <span class="ticker-tag">Node.js</span>
            <span class="ticker-tag">Python</span>
            <span class="ticker-tag">Java</span>
            <span class="ticker-tag">PostgreSQL</span>
            <span class="ticker-tag">Docker</span>
          </div>
        </div>

      </div>

      <!-- Highlights Grid -->
      <div class="highlights-section">
        <h2 class="section-heading"><i class="fas fa-cubes"></i> Engineering Pillars</h2>
        <div class="cards-grid">
          <div class="highlight-card" *ngFor="let item of highlights">
            <div class="card-icon"><i [class]="item.icon"></i></div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
            <div class="tags">
              <span *ngFor="let t of item.technologies" class="tag">{{ t }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .sde-hero-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1.5rem 1rem 4rem;
      color: #e2e8f0;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: radial-gradient(ellipse at top, rgba(14, 165, 233, 0.05) 0%, transparent 50%);
    }
    .hero-grid {
      display: grid;
      grid-template-columns: 1.2fr 0.8fr;
      gap: 2.5rem;
      align-items: center;
      margin-bottom: 3.5rem;
      animation: fadeInUp 0.8s ease-out;
    }
    @media (max-width: 900px) {
      .hero-grid {
        grid-template-columns: 1fr;
        gap: 2rem;
      }
    }
    .badge-sde {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(14, 165, 233, 0.12);
      border: 1px solid rgba(14, 165, 233, 0.4);
      color: #38bdf8;
      padding: 0.35rem 0.8rem;
      border-radius: 9999px;
      font-size: 0.78rem;
      font-weight: 600;
      letter-spacing: 0.05em;
      margin-bottom: 1rem;
      animation: glowPulse 3s ease-in-out infinite;
    }
    .hero-title {
      font-size: clamp(1.6rem, 5vw, 2.75rem);
      font-weight: 800;
      line-height: 1.25;
      color: #ffffff;
      margin-bottom: 1rem;
      word-break: break-word;
      text-shadow: 0 0 40px rgba(56, 189, 248, 0.3);
    }
    .highlight {
      background: linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #c084fc 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-size: 200% 200%;
      animation: gradientShift 3s ease infinite;
    }
    .typing-cursor {
      display: inline-block;
      color: #38bdf8;
      font-weight: 300;
      margin-left: 2px;
      animation: cursorBlink 0.9s infinite;
      vertical-align: baseline;
    }
    @keyframes cursorBlink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
    .hero-description {
      font-size: 0.98rem;
      line-height: 1.6;
      color: #94a3b8;
      margin-bottom: 1.5rem;
    }
    .text-white {
      color: #f8fafc;
    }
    .hero-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
      margin-bottom: 1.8rem;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.65rem 1.1rem;
      border-radius: 8px;
      font-size: 0.88rem;
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: none;
      position: relative;
      overflow: hidden;
    }
    .btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
      transition: left 0.5s;
    }
    .btn:hover::before {
      left: 100%;
    }
    .btn-sde-primary {
      background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
      color: #fff;
      box-shadow: 0 4px 14px rgba(2, 132, 199, 0.35), 0 0 20px rgba(56, 189, 248, 0.2);
    }
    .btn-sde-primary:hover {
      background: linear-gradient(135deg, #0369a1 0%, #075985 100%);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(2, 132, 199, 0.45), 0 0 30px rgba(56, 189, 248, 0.3);
    }
    .btn-sde-secondary {
      background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
      color: #e2e8f0;
      border: 1px solid #334155;
    }
    .btn-sde-secondary:hover {
      background: linear-gradient(135deg, #334155 0%, #475569 100%);
      color: #fff;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(51, 65, 85, 0.4);
    }
    .btn-sde-outline {
      background: transparent;
      color: #38bdf8;
      border: 1px solid rgba(56, 189, 248, 0.4);
    }
    .btn-sde-outline:hover {
      background: rgba(56, 189, 248, 0.15);
      border-color: rgba(56, 189, 248, 0.6);
      box-shadow: 0 0 15px rgba(56, 189, 248, 0.3);
    }

    /* Resume Split Button & Dropdown */
    .resume-wrapper {
      position: relative;
      display: inline-block;
    }
    .btn-split {
      display: inline-flex;
      align-items: center;
      padding: 0;
      overflow: hidden;
    }
    .btn-split-main {
      padding: 0.75rem 1rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .btn-split-divider {
      width: 1px;
      height: 24px;
      background: rgba(56, 189, 248, 0.3);
    }
    .btn-split-icon {
      padding: 0.75rem 0.75rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .btn-split-icon:hover {
      background: rgba(56, 189, 248, 0.2);
    }
    .resume-dropdown {
      position: absolute;
      top: calc(100% + 8px);
      left: 0;
      background: rgba(15, 23, 42, 0.95);
      backdrop-filter: blur(10px);
      border: 1px solid #334155;
      border-radius: 8px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.6), 0 0 20px rgba(56, 189, 248, 0.1);
      z-index: 100;
      min-width: 150px;
      overflow: hidden;
      animation: slideDown 0.2s ease-out;
    }
    .resume-dropdown button {
      width: 100%;
      padding: 0.7rem 1rem;
      background: transparent;
      border: none;
      color: #cbd5e1;
      font-size: 0.88rem;
      font-weight: 500;
      text-align: left;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.6rem;
      transition: all 0.2s;
    }
    .resume-dropdown button:hover {
      background: rgba(56, 189, 248, 0.1);
      color: #38bdf8;
      padding-left: 1.2rem;
    }
    .resume-dropdown button.delete-btn:hover {
      color: #ef4444;
      background: rgba(239, 68, 68, 0.1);
    }
    .resume-dropdown button.disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .tech-ticker {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      flex-wrap: wrap;
      font-size: 0.85rem;
    }
    .ticker-label {
      color: #64748b;
      font-weight: 600;
    }
    .ticker-tag {
      background: linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.8) 100%);
      border: 1px solid #1e293b;
      color: #cbd5e1;
      padding: 0.2rem 0.6rem;
      border-radius: 4px;
      transition: all 0.2s;
    }
    .ticker-tag:hover {
      border-color: #38bdf8;
      color: #38bdf8;
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(56, 189, 248, 0.2);
    }
    .ide-window {
      background: #090d16;
      border: 1px solid #1e293b;
      border-radius: 12px;
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.5), 0 0 40px rgba(56, 189, 248, 0.1);
      overflow: hidden;
    }
    .ide-header {
      background: #0f172a;
      padding: 0.75rem 1rem;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #1e293b;
    }
    .window-dots {
      display: flex;
      gap: 6px;
    }
    .dot {
      width: 11px;
      height: 11px;
      border-radius: 50%;
    }
    .dot-red { background: #ef4444; }
    .dot-yellow { background: #f59e0b; }
    .dot-green { background: #10b981; }
    .ide-title {
      margin-left: 1rem;
      font-size: 0.8rem;
      color: #64748b;
      font-family: monospace;
    }
    .ide-body {
      padding: 1.5rem;
      font-family: 'Fira Code', 'Courier New', monospace;
      font-size: 0.92rem;
      line-height: 1.6;
    }
    .code-block {
      margin: 0;
      color: #e2e8f0;
    }
    .k { color: #f43f5e; }
    .v { color: #38bdf8; }
    .p { color: #a5b4fc; }
    .s { color: #34d399; }
    .highlights-section {
      margin-top: 3rem;
      border-top: 1px solid #1e293b;
      padding-top: 3rem;
      animation: fadeInUp 0.8s ease-out 0.2s backwards;
    }
    .section-heading {
      font-size: 1.6rem;
      font-weight: 700;
      color: #f8fafc;
      margin-bottom: 1.8rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
    }
    .highlight-card {
      background: linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%);
      border: 1px solid #1e293b;
      padding: 1.75rem;
      border-radius: 10px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }
    .highlight-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, transparent, #38bdf8, transparent);
      opacity: 0;
      transition: opacity 0.3s;
    }
    .highlight-card:hover {
      transform: translateY(-5px);
      border-color: #38bdf8;
      box-shadow: 0 8px 25px rgba(56, 189, 248, 0.2), 0 0 30px rgba(56, 189, 248, 0.1);
    }
    .highlight-card:hover::before {
      opacity: 1;
    }
    .card-icon {
      font-size: 1.8rem;
      color: #38bdf8;
      margin-bottom: 1rem;
      text-shadow: 0 0 20px rgba(56, 189, 248, 0.5);
    }
    .highlight-card h3 {
      font-size: 1.2rem;
      font-weight: 600;
      color: #f1f5f9;
      margin-bottom: 0.6rem;
    }
    .highlight-card p {
      color: #94a3b8;
      font-size: 0.92rem;
      line-height: 1.5;
      margin-bottom: 1.2rem;
    }
    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
    }
    .tag {
      background: rgba(56, 189, 248, 0.1);
      color: #38bdf8;
      font-size: 0.75rem;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      border: 1px solid rgba(56, 189, 248, 0.2);
      transition: all 0.2s;
    }
    .tag:hover {
      background: rgba(56, 189, 248, 0.2);
      border-color: rgba(56, 189, 248, 0.4);
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes gradientShift {
      0%, 100% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
    }

    @keyframes glowPulse {
      0%, 100% {
        box-shadow: 0 0 5px rgba(56, 189, 248, 0.3);
      }
      50% {
        box-shadow: 0 0 15px rgba(56, 189, 248, 0.5);
      }
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class SdeHeroComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput') fileInput!: ElementRef;

  resumeUrl: string | null = null;
  dropdownOpen = false;

  // Typewriter effect phrases
  words: string[] = [
    'Web Apps',
    'Progressive Web Apps (PWAs)',
    'Modern Websites',
    'Mobile Apps',
    'Scalable Cloud APIs'
  ];
  currentWordIndex = 0;
  currentTypedText = signal('Web Apps');
  isDeleting = false;
  private typingTimeout: any;

  highlights: EngineeringHighlight[] = [
    {
      icon: 'fas fa-server',
      title: 'Secure Backend & Databases',
      description: 'Design of robust RESTful APIs, distributed microservices, secure database schemas (SQL/NoSQL), and cloud integrations.',
      technologies: ['Node.js', 'Express', 'Python', 'PostgreSQL', 'MongoDB', 'REST']
    },
    {
      icon: 'fas fa-desktop',
      title: 'Modern Frontend & UI/UX',
      description: 'Crafting performant Single Page Applications with responsive reactive state management, Angular signals, and standalone components.',
      technologies: ['Angular', 'TypeScript', 'RxJS', 'Signals', 'CSS3/SCSS']
    },
    {
      icon: 'fas fa-vial',
      title: 'Clean Architecture & DevOps',
      description: 'Commitment to clean architecture, automated testing, containerization, and modern CI/CD deployment pipelines.',
      technologies: ['Docker', 'Git', 'CI/CD', 'Jasmine', 'Netlify']
    }
  ];

  constructor(
    private dataService: DataService,
    public adminService: AdminService,
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit(): void {
    this.analyticsService.trackModeView('sde');
    this.dataService.resume$.subscribe(url => {
      this.resumeUrl = url;
    });
    this.startTypewriter();
  }

  ngOnDestroy(): void {
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }
  }

  private startTypewriter(): void {
    const currentWord = this.words[this.currentWordIndex];
    const text = this.currentTypedText();

    let typingSpeed = this.isDeleting ? 40 : 85;

    if (!this.isDeleting && text === currentWord) {
      typingSpeed = 1800; // Pause after word completes
      this.isDeleting = true;
    } else if (this.isDeleting && text === '') {
      this.isDeleting = false;
      this.currentWordIndex = (this.currentWordIndex + 1) % this.words.length;
      typingSpeed = 350; // Pause before starting next word
    } else {
      const nextText = this.isDeleting
        ? currentWord.substring(0, text.length - 1)
        : currentWord.substring(0, text.length + 1);
      this.currentTypedText.set(nextText);
    }

    this.typingTimeout = setTimeout(() => this.startTypewriter(), typingSpeed);
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  triggerUpload(): void {
    if (this.fileInput) {
      this.fileInput.nativeElement.click();
    }
    this.dropdownOpen = false;
  }

  async onFileSelected(event: any): Promise<void> {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Only PDF documents are allowed.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit.');
        return;
      }

      try {
        await this.dataService.uploadResume(file);
        alert('🚀 Resume uploaded successfully to Storage! Live across all pages.');
      } catch (err) {
        console.error('Resume upload failed', err);
        alert('❌ Upload failed. Please verify admin authentication and connection.');
      }
    }
  }

  downloadResume(): void {
    if (this.resumeUrl) {
      this.analyticsService.trackResumeDownload('sde');
      if (this.resumeUrl.startsWith('data:')) {
        const a = document.createElement('a');
        a.href = this.resumeUrl;
        a.download = 'Sumit_Jaiswal_Resume.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        openSafeExternalLink(this.resumeUrl);
      }
    } else {
      alert('Resume file is being updated. Please check back soon or contact me directly.');
    }
  }

  previewResume(): void {
    if (!this.resumeUrl) return;
    this.dropdownOpen = false;
    this.analyticsService.trackResumePreview('sde');
    if (!openFileSafely(this.resumeUrl)) {
      openSafeExternalLink(this.resumeUrl);
    }
  }

  async deleteResume(): Promise<void> {
    if (confirm("Are you sure you want to delete the active resume?")) {
      await this.dataService.updateResume(null);
      this.dropdownOpen = false;
      alert("Resume deleted successfully.");
    }
  }
}
