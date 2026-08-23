import {
  Component, OnInit, OnDestroy, HostListener,
  ElementRef, ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';

/**
 * SecretTerminalComponent
 * 
 * Advanced hidden terminal overlay triggered by backtick (`) pressed 3 times.
 * Features: command history, multiple commands, auth status tracking
 * 
 * Trigger: Press ` ` ` (backtick 3 times rapidly)
 * Password: REDACTED
 * Session: Persists until tab is closed
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

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.isAuthenticated = this.adminService.isAdmin;
    this.adminService.isAdmin$.subscribe(val => this.isAuthenticated = val);
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
      { text: '║     PORTFOLIO ADMIN TERMINAL v1.0    ║', type: 'output' },
      { text: '╚══════════════════════════════════════╝', type: 'output' },
      { text: '', type: 'output' },
      { text: 'Access restricted. Enter root path to continue.', type: 'output' },
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
    this.lines.push({ text: `> ${cmd}`, type: 'input' });
    this.inputValue = '';

    if (!this.isAuthenticated) {
      if (cmd === 'exit' || cmd === 'quit') {
        this.closeTerminal();
      } else if (cmd === 'help') {
        this.lines.push({ text: 'Enter password to authenticate as owner.', type: 'output' });
      } else {
        const success = await this.adminService.login("sj0269950@gmail.com", cmd);
        if (success) {
          this.lines.push({ text: '', type: 'output' });
          this.lines.push({ text: '✔  Access granted. Welcome back, Owner.', type: 'success' });
          this.lines.push({ text: '   Admin controls are now visible.', type: 'success' });
          this.lines.push({ text: '', type: 'output' });
          this.lines.push({ text: 'Type "exit" to close terminal.', type: 'output' });
        } else {
          this.lines.push({ text: `✘  Access denied. Invalid password.`, type: 'error' });
        }
      }
    } else {
      if (cmd === 'exit' || cmd === 'quit') {
        this.closeTerminal();
      } else if (cmd === 'logout') {
        await this.adminService.logout();
        this.lines.push({ text: '✔  Logged out. Admin controls hidden.', type: 'success' });
      } else if (cmd === 'status') {
        this.lines.push({ text: '● Status: AUTHENTICATED', type: 'success' });
      } else if (cmd === 'help') {
        this.lines.push({ text: 'Commands: logout | status | exit', type: 'output' });
      } else {
        this.lines.push({ text: `Command not found: ${cmd}`, type: 'error' });
      }
    }
  }
}
