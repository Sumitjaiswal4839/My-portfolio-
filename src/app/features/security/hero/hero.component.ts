import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../../services/data.service';
import { AdminService } from '../../../services/admin.service';
import { openSafeExternalLink } from '../../../core/utils/safe-url';

interface SecurityCard {
  icon: string;
  title: string;
  description: string;
  tags: string[];
}

@Component({
  selector: 'app-security-hero',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="sec-hero-container">
      <div class="hero-grid">
        <div class="hero-content">
          <div class="badge-cyber">
            <i class="fas fa-shield-alt"></i> CYBERSECURITY RESEARCHER &amp; ANALYST
          </div>
          <h1 class="hero-title">
            Defending <span class="highlight-cyan">Digital Frontiers</span> &amp; Penetration Testing
          </h1>
          <p class="hero-description">
            Hi, I'm <strong class="text-white">Sumit Jaiswal</strong>. Dedicated to offensive security, defensive system hardening, vulnerability research, secure databases &amp; backend mechanisms, and custom security analysis tooling.
          </p>
          <div class="hero-actions">
            <a routerLink="/security/certifications" class="btn btn-cyber-primary">
              <i class="fas fa-certificate"></i> View Certifications
            </a>
            <a routerLink="/security/projects" class="btn btn-cyber-secondary">
              <i class="fas fa-bug"></i> Security Projects &amp; Writeups
            </a>
            <a routerLink="/security/tools" class="btn btn-cyber-outline">
              <i class="fas fa-tools"></i> Security Tools
            </a>

            <!-- Resume Split Button / Dropdown -->
            <div class="resume-wrapper">
              <div class="btn btn-cyber-outline btn-split">
                <div class="btn-split-main" (click)="downloadResume()" title="Download Resume">
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
            <button class="btn btn-cyber-secondary" *ngIf="resumeUrl" (click)="previewResume()" title="Preview Resume in New Tab">
              <i class="fas fa-eye"></i> Preview
            </button>
          </div>

          <div class="status-box">
            <div class="status-item">
              <span class="status-dot"></span>
              <span class="status-text">Active CTF Player &amp; Security Researcher</span>
            </div>

          </div>
        </div>

        <div class="hero-terminal-wrap">
          <div class="terminal-card">
            <div class="terminal-top">
              <div class="term-dots">
                <span class="dot d-red"></span>
                <span class="dot d-yellow"></span>
                <span class="dot d-green"></span>
              </div>
              <span class="term-title">sec-shell&#64;kali: ~</span>
            </div>
            <div class="terminal-content" #terminalBody (click)="focusInput()">
              <div *ngFor="let line of terminalHistory" class="term-line" [innerHTML]="line"></div>
              <div class="term-input-row">
                <span class="prompt-symbol">root&#64;portfolio:~#</span>
                <input 
                  #terminalInput
                  type="text" 
                  [(ngModel)]="currentInput" 
                  (keydown)="handleInput($event)" 
                  class="term-input" 
                  autocomplete="off" 
                  spellcheck="false"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Security Specializations -->
      <div class="specializations-section">
        <h2 class="section-heading"><i class="fas fa-user-shield"></i> Security Domains</h2>
        <div class="spec-grid">
          <div class="spec-card" *ngFor="let item of specializations">
            <div class="spec-icon"><i [class]="item.icon"></i></div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
            <div class="spec-tags">
              <span *ngFor="let t of item.tags" class="tag">{{ t }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .sec-hero-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1.5rem 1rem 4rem;
      color: #00ff66;
      font-family: 'Courier New', Courier, monospace;
    }
    .hero-grid {
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
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
    .badge-cyber {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(0, 255, 102, 0.1);
      border: 1px solid rgba(0, 255, 102, 0.4);
      color: #00ff66;
      padding: 0.35rem 0.8rem;
      border-radius: 4px;
      font-size: 0.75rem;
      letter-spacing: 0.1em;
      margin-bottom: 1rem;
    }
    .hero-title {
      font-size: clamp(1.6rem, 5vw, 2.6rem);
      font-weight: 700;
      line-height: 1.25;
      color: #ffffff;
      margin-bottom: 1rem;
      font-family: system-ui, sans-serif;
      word-break: break-word;
    }
    .highlight-cyan {
      color: #00f0ff;
      text-shadow: 0 0 10px rgba(0, 240, 255, 0.4);
    }
    .hero-description {
      font-size: 0.98rem;
      line-height: 1.6;
      color: #94a3b8;
      margin-bottom: 1.5rem;
      font-family: system-ui, sans-serif;
    }
    .text-white { color: #ffffff; }
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
      border-radius: 6px;
      font-size: 0.88rem;
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.2s ease;
      font-family: system-ui, sans-serif;
    }
    .btn-cyber-primary {
      background: #00ff66;
      color: #050505;
      box-shadow: 0 0 15px rgba(0, 255, 102, 0.4);
    }
    .btn-cyber-primary:hover {
      background: #00cc52;
      box-shadow: 0 0 20px rgba(0, 255, 102, 0.6);
    }
    .btn-cyber-secondary {
      background: #0f172a;
      color: #00f0ff;
      border: 1px solid rgba(0, 240, 255, 0.4);
    }
    .btn-cyber-secondary:hover {
      background: rgba(0, 240, 255, 0.1);
    }
    .btn-cyber-outline {
      background: transparent;
      color: #00ff66;
      border: 1px solid rgba(0, 255, 102, 0.3);
    }
    .btn-cyber-outline:hover {
      background: rgba(0, 255, 102, 0.1);
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
      height: 22px;
      background: rgba(0, 255, 102, 0.3);
    }
    .btn-split-icon {
      padding: 0.75rem 0.75rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .btn-split-icon:hover {
      background: rgba(0, 255, 102, 0.2);
    }
    .resume-dropdown {
      position: absolute;
      top: calc(100% + 8px);
      left: 0;
      background: #030712;
      border: 1px solid #1e293b;
      border-radius: 6px;
      box-shadow: 0 10px 25px rgba(0, 255, 102, 0.15);
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
      font-size: 0.85rem;
      font-family: system-ui, sans-serif;
      text-align: left;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.6rem;
      transition: background 0.2s;
    }
    .resume-dropdown button:hover {
      background: #111827;
      color: #00ff66;
    }
    .resume-dropdown button.delete-btn:hover {
      color: #ef4444;
    }
    .resume-dropdown button.disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .status-box {
      background: rgba(15, 23, 42, 0.7);
      border: 1px solid #1e293b;
      padding: 1rem;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
    }
    .status-item {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      font-size: 0.88rem;
      color: #cbd5e1;
      font-family: system-ui, sans-serif;
    }
    .status-dot {
      width: 8px;
      height: 8px;
      background: #00ff66;
      border-radius: 50%;
      box-shadow: 0 0 8px #00ff66;
    }
    .cyber-icon {
      color: #f59e0b;
    }
    .terminal-card {
      background: #030712;
      border: 1px solid #1f2937;
      border-radius: 8px;
      box-shadow: 0 10px 30px rgba(0, 255, 102, 0.1);
      overflow: hidden;
    }
    .terminal-top {
      background: #111827;
      padding: 0.6rem 1rem;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #1f2937;
    }
    .term-dots {
      display: flex;
      gap: 6px;
    }
    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }
    .d-red { background: #ef4444; }
    .d-yellow { background: #f59e0b; }
    .d-green { background: #10b981; }
    .term-title {
      margin-left: 1rem;
      font-size: 0.78rem;
      color: #6b7280;
    }
    .terminal-content {
      padding: 1.25rem;
      min-height: 240px;
      max-height: 320px;
      overflow-y: auto;
      font-size: 0.88rem;
      line-height: 1.5;
    }
    .term-line {
      margin-bottom: 0.4rem;
      color: #d1d5db;
    }
    .term-input-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .prompt-symbol {
      color: #00ff66;
      font-weight: bold;
    }
    .term-input {
      background: transparent;
      border: none;
      outline: none;
      color: #00ff66;
      font-family: inherit;
      font-size: inherit;
      flex: 1;
    }
    .specializations-section {
      margin-top: 3rem;
      border-top: 1px solid #1f2937;
      padding-top: 3rem;
    }
    .section-heading {
      font-size: 1.5rem;
      color: #f3f4f6;
      font-family: system-ui, sans-serif;
      margin-bottom: 1.8rem;
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }
    .spec-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
    }
    .spec-card {
      background: #0b1120;
      border: 1px solid #1e293b;
      padding: 1.75rem;
      border-radius: 8px;
      font-family: system-ui, sans-serif;
      transition: all 0.2s ease;
    }
    .spec-card:hover {
      border-color: #00ff66;
      transform: translateY(-3px);
      box-shadow: 0 4px 20px rgba(0, 255, 102, 0.15);
    }
    .spec-icon {
      font-size: 1.75rem;
      color: #00ff66;
      margin-bottom: 1rem;
    }
    .spec-card h3 {
      font-size: 1.15rem;
      color: #f3f4f6;
      margin-bottom: 0.5rem;
    }
    .spec-card p {
      color: #94a3b8;
      font-size: 0.9rem;
      line-height: 1.5;
      margin-bottom: 1rem;
    }
    .spec-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
    }
    .tag {
      background: rgba(0, 255, 102, 0.1);
      color: #00ff66;
      font-size: 0.72rem;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      border: 1px solid rgba(0, 255, 102, 0.2);
    }
  `]
})
export class SecurityHeroComponent implements OnInit, AfterViewChecked {
  @ViewChild('terminalBody') terminalBody!: ElementRef;
  @ViewChild('terminalInput') terminalInput!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;

  resumeUrl: string | null = null;
  dropdownOpen = false;

  currentInput = '';
  terminalHistory: string[] = [
    '<span style="color:#00ff66">[INIT]</span> Security Terminal v2.1 initialized',
    '<span style="color:#00f0ff">[INFO]</span> Target: Sumit Jaiswal Cybersecurity Profile',
    'Type <span style="color:#f59e0b">help</span> to list commands'
  ];

  specializations: SecurityCard[] = [
    {
      icon: 'fas fa-shield-virus',
      title: 'Vulnerability Assessment & Pentest',
      description: 'Web application and network penetration testing, OWASP Top 10 auditing, and remediation advisory.',
      tags: ['Burp Suite', 'Nmap', 'Metasploit', 'OWASP']
    },
    {
      icon: 'fas fa-search-location',
      title: 'Malware Analysis & Forensics',
      description: 'Static/dynamic binary analysis, network artifact extraction, memory dump inspection, and incident triage.',
      tags: ['Wireshark', 'Ghidra', 'Volatility', 'SIEM']
    },
    {
      icon: 'fas fa-terminal',
      title: 'Security Tool Development',
      description: 'Building custom recon scanners, log parsers, fuzzers, and automated security verification scripts.',
      tags: ['Python', 'Bash', 'Scapy', 'Regex']
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

  ngAfterViewChecked(): void {
    if (this.terminalBody) {
      this.terminalBody.nativeElement.scrollTop = this.terminalBody.nativeElement.scrollHeight;
    }
  }

  focusInput(): void {
    if (this.terminalInput) {
      this.terminalInput.nativeElement.focus();
    }
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
          alert("❌ Upload failed. Please verify admin authentication.");
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

  handleInput(event: KeyboardEvent): void {
    if (event.key === 'Enter' && this.currentInput.trim()) {
      const cmd = this.currentInput.trim().toLowerCase();
      this.terminalHistory.push(`<span style="color:#00ff66">root&#64;portfolio:~#</span> ${this.currentInput}`);
      this.processCommand(cmd);
      this.currentInput = '';
    }
  }

  private processCommand(cmd: string): void {
    switch (cmd) {
      case 'help':
        this.terminalHistory.push('<span style="color:#38bdf8">Commands:</span> certs, tools, ctf, writeups, resume, clear');
        break;
      case 'certs':
        this.terminalHistory.push('Certifications: CompTIA Security+, CEH (in prep), TryHackMe Rank: Top 5%');
        break;
      case 'tools':
        this.terminalHistory.push('Tools: Custom Recon Scanner, Packet Sniffer, Hash Identifier, Subdomain Finder');
        break;
      case 'ctf':
        this.terminalHistory.push('CTF Platforms: TryHackMe, HackTheBox, OverTheWire, PicoCTF');
        break;
      case 'writeups':
        this.terminalHistory.push('Check the Security Projects & Writeups section for published walkthroughs.');
        break;
      case 'resume':
        this.downloadResume();
        break;
      case 'clear':
        this.terminalHistory = [];
        break;
      default:
        this.terminalHistory.push(`<span style="color:#ef4444">Command not found:</span> ${cmd}. Type "help"`);
    }
  }
}
