import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { ModeService, PortfolioMode } from '../../core/services/mode.service';
import { CommitButtonComponent } from '../commit-button/commit-button.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, CommitButtonComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  mobileMenuOpen = signal(false);

  constructor(
    public themeService: ThemeService,
    public modeService: ModeService,
    private router: Router
  ) {}

  toggleMenu(): void {
    this.mobileMenuOpen.update(v => !v);
  }

  closeMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  switchMode(newMode: 'sde' | 'security'): void {
    this.modeService.setMode(newMode);
    this.closeMenu();
    this.router.navigate([`/${newMode}`]);
  }

  openLandingChoice(): void {
    this.closeMenu();
    this.router.navigate(['/landing']);
  }
}
