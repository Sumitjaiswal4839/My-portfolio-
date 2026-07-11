import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AdminService } from '../../services/admin.service';
import { DataService } from '../../services/data.service';
import { AdminOnlyDirective } from '../../directives/admin-only.directive';

interface SkillCard {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RouterLink, AdminOnlyDirective, FormsModule],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css']
})
export class HeroComponent implements OnInit, AfterViewChecked, OnDestroy {
  constructor(
    public authService: AuthService,
    public adminService: AdminService,
    private dataService: DataService
  ) {}

  skillCards: SkillCard[] = [
    {
      icon: 'fas fa-lock',
      title: 'Network Security',
      description: 'Firewall configuration, IDS/IPS implementation, VPN setup and secure network architecture'
    },
    {
      icon: 'fas fa-bug',
      title: 'Penetration Testing',
      description: 'Web application testing, vulnerability assessment, and exploit development'
    },
    {
      icon: 'fas fa-code',
      title: 'Secure Coding',
      description: 'Python, JavaScript, Bash scripting with security-first approach'
    },
    {
      icon: 'fas fa-shield-virus',
      title: 'Malware Analysis',
      description: 'Reverse engineering, threat detection, and behavioral analysis'
    },
    {
      icon: 'fas fa-server',
      title: 'System Hardening',
      description: 'Linux/Windows security, compliance frameworks, and security auditing'
    },
    {
      icon: 'fas fa-search',
      title: 'Digital Forensics',
      description: 'Incident response, digital investigation, and evidence collection'
    }
  ];

  resumeUrl: string | null = null;
  dropdownOpen = false;

  // Interactive Terminal State
  terminalHistory: string[] = [
    'Welcome to Sumit\'s Security Terminal',
    'Type "help" to see available commands'
  ];
  currentInput = '';

  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('termBody') termBody!: ElementRef;
  @ViewChild('termInput') termInput!: ElementRef;



  ngOnInit(): void {
    if (window.innerWidth > 1024) {
      document.body.classList.add('no-scroll-home');
    }
    this.dataService.resume$.subscribe(url => {
      this.resumeUrl = url;
    });
  }

  ngOnDestroy(): void {
    if (window.innerWidth > 1024) {
      document.body.classList.remove('no-scroll-home');
    }
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      this.termBody.nativeElement.scrollTop = this.termBody.nativeElement.scrollHeight;
    } catch (err) {}
  }

  focusTerminal(): void {
    this.termInput.nativeElement.focus();
  }

  handleTerminalInput(event: KeyboardEvent): void {
    if (event.key === 'Enter' && this.currentInput.trim()) {
      const input = this.currentInput.trim().toLowerCase();
      this.terminalHistory.push(`<span class="prompt">$</span> ${this.currentInput}`);
      
      this.processCommand(input);
      this.currentInput = '';
    }
  }

  private processCommand(cmd: string): void {
    switch (cmd) {
      case 'help':
        this.terminalHistory.push('Available commands: skills, projects, contact, clear, about, resume');
        break;
      case 'skills':
        this.terminalHistory.push('Network Security | Pen Testing | Secure Coding | Malware Analysis | Digital Forensics');
        break;
      case 'projects':
        this.terminalHistory.push('Try "View Projects" button below or visit my GitHub for live samples.');
        break;
      case 'contact':
        this.terminalHistory.push('Email: sj0269950@gmail.com | WhatsApp: +91 7827584476');
        break;
      case 'about':
        this.terminalHistory.push('Cybersecurity enthusiast, pursuing CEH/OSCP. Specialized in defensive & offensive security.');
        break;
      case 'resume':
        this.terminalHistory.push('Generating download link...');
        this.downloadResume();
        break;
      case 'clear':
        this.terminalHistory = [];
        break;
      default:
        this.terminalHistory.push(`Command not found: ${cmd}. Type "help" for assistance.`);
    }
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  triggerUpload() {
    this.fileInput.nativeElement.click();
    this.dropdownOpen = false;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // FIREBASE FIRESTORE LIMIT: Document size is 1MB.
      // If file is larger than ~750KB (considering base64 overhead), it might fail.
      if (file.size > 1000000) {
         alert("File too large! Firestore documents have a 1MB limit. Please upload a smaller PDF (less than 1MB) or use a compressed version.");
         return;
      }

      const reader = new FileReader();
      reader.onload = async (e: any) => {
        try {
          const base64Url = e.target.result;
          await this.dataService.updateResume(base64Url);
          alert("🚀 Resume uploaded successfully! Changes are live across all devices.");
        } catch (err) {
          console.error("Upload failed", err);
          alert("❌ Upload failed. Make sure Firestore is enabled in 'test mode' in your Firebase console and your internet is connected.");
        }
      };
      reader.readAsDataURL(file);
    }
  }

  downloadResume() {
    if (this.resumeUrl) {
      const a = document.createElement('a');
      a.href = this.resumeUrl;
      a.download = 'Sumit_Jaiswal_Resume.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      alert("No resume uploaded yet. Please upload one first by clicking the 3 dots.");
    }
  }

  previewResume() {
    if (this.resumeUrl) {
      this.dropdownOpen = false;
      const pdfWindow = window.open("");
      if (pdfWindow) {
        pdfWindow.document.write(`<iframe width='100%' height='100%' style='border:none;' src='${this.resumeUrl}'></iframe>`);
      }
    }
  }

  async deleteResume() {
    if (confirm("Are you sure you want to delete your resume?")) {
      await this.dataService.updateResume(null);
      this.dropdownOpen = false;
    }
  }
}
