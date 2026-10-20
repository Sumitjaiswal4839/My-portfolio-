import {
  Component, OnInit, OnDestroy, HostListener,
  ElementRef, ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { AnalyticsService } from '../../core/services/analytics.service';

/**
 * SecretTerminalComponent [SECURITY 3.2]
 * 
 * Hidden admin terminal overlay triggered by backtick (`) pressed 3 times.
 * Features: real Firebase authentication, command execution, session lifecycle
 * 
 * Trigger: Press ` ` ` (backtick 3 times rapidly)
 * Session: Persists only within current browser session (browserSessionPersistence)
 */
@Component({
  selector: 'app-secret-terminal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './secret-terminal.component.html',
  styleUrls: ['./secret-terminal.component.scss']
})
export class SecretTerminalComponent implements OnInit, OnDestroy {
  @ViewChild('terminalInput') terminalInput!: ElementRef;

  isOpen = false;
  inputValue = '';
  lines: { text: string; type: 'output' | 'error' | 'success' | 'input' }[] = [];
  isAuthenticated = false;
  showPassword = false;
  pendingEmail = '';

  get passwordInputType(): string {
    if (this.isAuthenticated || this.showPassword) {
      return 'text';
    }
    // Mask input if entering password
    return this.pendingEmail ? 'password' : 'text';
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // Key sequence tracker: backtick pressed 3 times rapidly
  private keySequence: string[] = [];
  private sequenceTimeout: any;

  constructor(
    public adminService: AdminService,
    private analyticsService: AnalyticsService
  ) { }

  ngOnInit(): void {
    this.isAuthenticated = this.adminService.isAdmin;
    this.adminService.isAdmin$.subscribe(val => {
      this.isAuthenticated = val;
    });
  }

  ngOnDestroy(): void {
    clearTimeout(this.sequenceTimeout);
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    // Trigger: backtick (`) pressed 3 times rapidly
    if (event.key === '`') {
      this.keySequence.push('`');
      clearTimeout(this.sequenceTimeout);
      this.sequenceTimeout = setTimeout(() => {
        this.keySequence = [];
      }, 1000);

      if (this.keySequence.length >= 3) {
        this.keySequence = [];
        this.openTerminal();
      }
    }

    // Close terminal on Escape
    if (event.key === 'Escape' && this.isOpen) {
      this.closeTerminal();
    }
  }

  openTerminal(): void {
    this.isOpen = true;
    this.pendingEmail = '';
    this.lines = [
      { text: '╔══════════════════════════════════════╗', type: 'output' },
      { text: '║     PORTFOLIO ADMIN TERMINAL v2.0    ║', type: 'output' },
      { text: '╚══════════════════════════════════════╝', type: 'output' },
      { text: '', type: 'output' },
      { text: `Auth status: ${this.isAuthenticated ? 'AUTHENTICATED' : 'ANONYMOUS'}`, type: 'output' },
      { text: this.isAuthenticated ? 'Type "help" for available commands.' : 'Access restricted. Enter admin email or "login <email> <password>":', type: 'output' },
      { text: '', type: 'output' },
    ];
    this.inputValue = '';
    this.showPassword = false;
    setTimeout(() => {
      if (this.terminalInput?.nativeElement) {
        this.terminalInput.nativeElement.focus();
      }
    }, 100);
  }

  closeTerminal(): void {
    this.isOpen = false;
    this.inputValue = '';
    this.pendingEmail = '';
    this.showPassword = false;
    this.lines = [];
  }

  async onEnter(): Promise<void> {
    const cmd = this.inputValue.trim();
    if (!cmd) return;

    const isEnteringPassword = !this.isAuthenticated && !!this.pendingEmail;
    const echoText = isEnteringPassword
      ? `> ${'*'.repeat(cmd.length)}`
      : `> ${cmd}`;
    this.lines.push({ text: echoText, type: 'input' });
    this.inputValue = '';

    if (!this.isAuthenticated) {
      if (cmd === 'exit' || cmd === 'quit') {
        this.closeTerminal();
        return;
      }
      if (cmd === 'help') {
        this.lines.push({ text: 'Authentication options:', type: 'output' });
        this.lines.push({ text: '  1. Type your email, hit enter, then type password.', type: 'output' });
        this.lines.push({ text: '  2. Type: login <email> <password>', type: 'output' });
        return;
      }

      if (cmd.startsWith('login ')) {
        const credentials = cmd.substring(6).trim();
        this.lines.push({ text: 'Authenticating with Firebase Auth...', type: 'output' });
        const success = await this.adminService.login(credentials);
        this.handleLoginResult(success);
        return;
      }

      if (!this.pendingEmail) {
        if (cmd.includes('@')) {
          this.pendingEmail = cmd;
          this.lines.push({ text: `Admin identity accepted. Enter password:`, type: 'output' });
        } else {
          this.lines.push({ text: `Please enter a valid administrator email or type "login <email> <password>".`, type: 'error' });
        }
      } else {
        const email = this.pendingEmail;
        this.pendingEmail = '';
        this.lines.push({ text: 'Authenticating with Firebase Auth...', type: 'output' });
        const success = await this.adminService.login(email, cmd);
        this.handleLoginResult(success);
      }
    } else {
      if (cmd === 'exit' || cmd === 'quit') {
        this.closeTerminal();
      } else if (cmd === 'logout') {
        await this.adminService.logout();
        this.lines.push({ text: '✔  Logged out. Session cleared.', type: 'success' });
      } else if (cmd === 'status') {
        const user = this.adminService.currentUser;
        this.lines.push({ text: `● Status: AUTHENTICATED (${user?.email})`, type: 'success' });
      } else if (cmd === 'stats') {
        const stats = this.analyticsService.getSummary();
        this.lines.push({ text: '╔═══════════════════════════════════════════╗', type: 'output' });
        this.lines.push({ text: '║        PORTFOLIO ENGAGEMENT STATS         ║', type: 'output' });
        this.lines.push({ text: '╚═══════════════════════════════════════════╝', type: 'output' });
        this.lines.push({ text: `● Security Views:            ${stats.securityViews}`, type: 'output' });
        this.lines.push({ text: `● SDE (Engineering) Views:   ${stats.sdeViews}`, type: 'output' });
        this.lines.push({ text: `---------------------------------------------`, type: 'output' });
        this.lines.push({ text: `● Security CV Downloads:     ${stats.securityResumeDownloads}`, type: 'success' });
        this.lines.push({ text: `● SDE CV Downloads:          ${stats.sdeResumeDownloads}`, type: 'success' });
        this.lines.push({ text: `● Security CV Previews:      ${stats.securityResumePreviews}`, type: 'output' });
        this.lines.push({ text: `● SDE CV Previews:           ${stats.sdeResumePreviews}`, type: 'output' });
        this.lines.push({ text: `---------------------------------------------`, type: 'output' });
        const leader = stats.securityResumeDownloads > stats.sdeResumeDownloads
          ? 'Security CV has higher attention/demand'
          : stats.sdeResumeDownloads > stats.securityResumeDownloads
          ? 'SDE CV has higher attention/demand'
          : 'Both CV versions have equal attention';
        this.lines.push({ text: `Attention Insight: ${leader}`, type: 'success' });
        this.lines.push({ text: `Google Analytics (GA4): Connected (G-0X4X9KJBHM)`, type: 'output' });
      } else if (cmd === 'help') {
        this.lines.push({ text: 'Available commands: stats | status | logout | clear | exit', type: 'output' });
      } else if (cmd === 'clear') {
        this.lines = [];
      } else {
        this.lines.push({ text: `Command not found: ${cmd}`, type: 'error' });
      }
    }
  }

  private handleLoginResult(success: boolean): void {
    if (success) {
      this.lines.push({ text: '', type: 'output' });
      this.lines.push({ text: '✔  Access granted. Welcome back, Administrator.', type: 'success' });
      this.lines.push({ text: '   Admin controls and editing capabilities enabled.', type: 'success' });
      this.lines.push({ text: '', type: 'output' });
      this.lines.push({ text: 'Type "exit" to close terminal or "help" for commands.', type: 'output' });
    } else {
      this.lines.push({ text: `✘  Access denied. Authentication failed or missing admin claim.`, type: 'error' });
      this.lines.push({ text: 'Enter admin email to try again:', type: 'output' });
    }
  }
}
