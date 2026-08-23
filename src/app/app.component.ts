import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MatrixBgComponent } from './components/matrix-bg/matrix-bg.component';
import { BottomBarComponent } from './components/bottom-bar/bottom-bar.component';
import { BottomInfoComponent } from './components/bottom-info/bottom-info.component';
import { SecretTerminalComponent } from './components/secret-terminal/secret-terminal.component';
import { ThemeService } from './services/theme.service';

import { DataService } from './services/data.service';

/**
 * AppComponent - Root component
 * 
 * Features:
 * - Matrix background animation
 * - Navigation bar
 * - Bottom bar
 * - Secret terminal (press ` 3 times to open)
 * - Theme service initialization
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    MatrixBgComponent,
    BottomBarComponent,
    BottomInfoComponent,
    SecretTerminalComponent,
    CommonModule
  ],
  template: `
    <div *ngIf="dataService.loadError$ | async as errorMessage" style="background-color:#ef4444; color:white; text-align:center; padding:8px 16px; font-size:14px; position: relative; z-index: 1000;">
      {{ errorMessage }}
    </div>
    <app-matrix-bg></app-matrix-bg>
    <app-navbar></app-navbar>
    
    <main class="main-content">
      <router-outlet></router-outlet>
    </main>
    
    <app-bottom-bar></app-bottom-bar>
    <app-bottom-info></app-bottom-info>
    
    <!-- Secret Terminal (Backtick × 3 to trigger) -->
    <app-secret-terminal></app-secret-terminal>
  `,
  styles: [`
    .main-content {
      position: relative;
      z-index: 1;
    }
  `]
})
export class AppComponent implements OnInit {
  constructor(private themeService: ThemeService, public dataService: DataService) {}

  ngOnInit(): void {
    this.themeService.initTheme();
  }
}
