import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../../services/data.service';
import { AdminService } from '../../../services/admin.service';
import { openSafeExternalLink } from '../../../core/utils/safe-url';

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
            Architecting <span class="highlight">Scalable Systems</span> &amp; Modern Applications
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

        <div class="hero-interactive">
          <div class="ide-window">
            <div class="ide-header">
              <div class="window-dots">
                <span class="dot dot-red"></span>
                <span class="dot dot-yellow"></span>
                <span class="dot dot-green"></span>
              </div>
              <div class="ide-title">engineer_profile.ts</div>
            </div>
            <div class="ide-body">
              <pre class="code-block"><code><span class="k">const</span> <span class="v">engineer</span> = &#123;
  <span class="p">name:</span> <span class="s">'Sumit Jaiswal'</span>,
  <span class="p">role:</span> <span class="s">'Software Development Engineer'</span>,
  <span class="p">expertise:</span> [<span class="s">'Full-Stack Architecture'</span>, <span class="s">'Secure Backend &amp; DB'</span>, <span class="s">'Modern UI/UX'</span>],
  <span class="p">mindset:</span> <span class="s">'Build robust, high-performance, maintainable systems'</span>,
  <span class="p">status:</span> <span class="s">'Ready for high-impact engineering opportunities'</span>
&#125;;

<span class="k">export default</span> <span class="v">engineer</span>;</code></pre>
            </div>
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
    }
    .hero-grid {
      display: grid;
      grid-template-columns: 1.2fr 0.8fr;
      gap: 2.5rem;
      align-items: center;
      margin-bottom: 3.5rem;
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
    }
    .hero-title {
      font-size: clamp(1.6rem, 5vw, 2.75rem);
      font-weight: 800;
      line-height: 1.25;
      color: #ffffff;
      margin-bottom: 1rem;
      word-break: break-word;
    }
    .highlight {
      background: linear-gradient(135deg, #38bdf8 0%, #818cf8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
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
      transition: all 0.2s ease;
      border: none;
    }
    .btn-sde-primary {
      background: #0284c7;
      color: #fff;
      box-shadow: 0 4px 14px rgba(2, 132, 199, 0.35);
    }
    .btn-sde-primary:hover {
      background: #0369a1;
      transform: translateY(-2px);
    }
    .btn-sde-secondary {
      background: #1e293b;
      color: #e2e8f0;
      border: 1px solid #334155;
    }
    .btn-sde-secondary:hover {
      background: #334155;
      color: #fff;
    }
    .btn-sde-outline {
      background: transparent;
      color: #38bdf8;
      border: 1px solid rgba(56, 189, 248, 0.4);
    }
    .btn-sde-outline:hover {
      background: rgba(56, 189, 248, 0.1);
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
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 8px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.6);
      z-index: 100;
      min-width: 150px;
      overflow: hidden;
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
      transition: background 0.2s;
    }
    .resume-dropdown button:hover {
      background: #1e293b;
      color: #38bdf8;
    }
    .resume-dropdown button.delete-btn:hover {
      color: #ef4444;
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
      background: #0f172a;
      border: 1px solid #1e293b;
      color: #cbd5e1;
      padding: 0.2rem 0.6rem;
      border-radius: 4px;
    }
    .ide-window {
      background: #090d16;
      border: 1px solid #1e293b;
      border-radius: 12px;
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.5);
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
      background: #0f172a;
      border: 1px solid #1e293b;
      padding: 1.75rem;
      border-radius: 10px;
      transition: transform 0.2s, border-color 0.2s;
    }
    .highlight-card:hover {
      transform: translateY(-3px);
      border-color: #38bdf8;
    }
    .card-icon {
      font-size: 1.8rem;
      color: #38bdf8;
      margin-bottom: 1rem;
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
    }
  `]
})
export class SdeHeroComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;

  resumeUrl: string | null = null;
  dropdownOpen = false;

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
    public adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.dataService.resume$.subscribe(url => {
      this.resumeUrl = url;
    });
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

  onFileSelected(event: any): void {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 1000000) {
        alert("File size exceeds 1MB limit for Firestore storage. Please upload a smaller compressed PDF.");
        return;
      }

      const reader = new FileReader();
      reader.onload = async (e: any) => {
        try {
          const base64Url = e.target.result;
          await this.dataService.updateResume(base64Url);
          alert("🚀 Resume uploaded successfully! Live across all pages.");
        } catch (err) {
          console.error("Resume upload failed", err);
          alert("❌ Upload failed. Please verify admin authentication and connection.");
        }
      };
      reader.readAsDataURL(file);
    }
  }

  downloadResume(): void {
    if (this.resumeUrl) {
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
    if (this.resumeUrl.startsWith('data:')) {
      try {
        const arr = this.resumeUrl.split(',');
        const mimeMatch = arr[0].match(/:(.*?);/);
        const mime = mimeMatch ? mimeMatch[1] : 'application/pdf';
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        const blob = new Blob([u8arr], { type: mime });
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, '_blank', 'noopener,noreferrer');
      } catch (e) {
        console.error('Could not preview data URL', e);
      }
    } else {
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
