import {
  Component, OnInit, OnDestroy, HostListener,
  ElementRef, ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, ADMIN_EMAIL } from '../../services/admin.service';

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

  // Key sequence tracker: backtick pressed 3 times rapidly
  private keySequence: string[] = [];
  private sequenceTimeout: any;

  constructor(public adminService: AdminService) { }

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
    this.lines = [
      { text: '╔══════════════════════════════════════╗', type: 'output' },
      { text: '║     PORTFOLIO ADMIN TERMINAL v2.0    ║', type: 'output' },
      { text: '╚══════════════════════════════════════╝', type: 'output' },
      { text: '', type: 'output' },
      { text: `Auth status: ${this.isAuthenticated ? 'AUTHENTICATED' : 'ANONYMOUS'}`, type: 'output' },
      { text: this.isAuthenticated ? 'Type "help" for available commands.' : 'Access restricted. Enter admin password to authenticate.', type: 'output' },
      { text: '', type: 'output' },
    ];
    this.inputValue = '';
    setTimeout(() => {
      if (this.terminalInput?.nativeElement) {
        this.terminalInput.nativeElement.focus();
      }
    }, 100);
  }

  closeTerminal(): void {
    this.isOpen = false;
    this.inputValue = '';
    this.lines = [];
  }

  async onEnter(): Promise<void> {
    const cmd = this.inputValue.trim();
    if (!cmd) return;

    this.lines.push({ text: `> ${cmd}`, type: 'input' });
    this.inputValue = '';

    if (!this.isAuthenticated) {
      if (cmd === 'exit' || cmd === 'quit') {
        this.closeTerminal();
      } else if (cmd === 'help') {
        this.lines.push({ text: 'Enter your administrator password to authenticate.', type: 'output' });
      } else {
        // Real authentication via Firebase Auth
        this.lines.push({ text: 'Authenticating with Firebase Auth...', type: 'output' });
        const success = await this.adminService.login(cmd, ADMIN_EMAIL);
        if (success) {
          this.lines.push({ text: '', type: 'output' });
          this.lines.push({ text: '✔  Access granted. Welcome back, Administrator.', type: 'success' });
          this.lines.push({ text: '   Admin controls and editing capabilities enabled.', type: 'success' });
          this.lines.push({ text: '', type: 'output' });
          this.lines.push({ text: 'Type "exit" to close terminal or "help" for commands.', type: 'output' });
        } else {
          this.lines.push({ text: `✘  Access denied. Authentication failed.`, type: 'error' });
        }
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
      } else if (cmd === 'help') {
        this.lines.push({ text: 'Available commands: logout | status | clear | exit', type: 'output' });
      } else if (cmd === 'clear') {
        this.lines = [];
      } else {
        this.lines.push({ text: `Command not found: ${cmd}`, type: 'error' });
      }
    }
  }
}
