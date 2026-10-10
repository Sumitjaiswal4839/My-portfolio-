import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ModeService, PortfolioMode } from '../../core/services/mode.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="landing-container">
      <div class="choice-box">
        <div class="logo-header">
          <div class="logo-icon">
            <i class="fas fa-terminal"></i>
          </div>
          <h1 class="name-title">Sumit Jaiswal</h1>
          <p class="tagline">Multi-Disciplinary Developer & Security Researcher</p>
        </div>

        <h2 class="selection-title">Choose Your Path</h2>
        <div class="buttons">
          <button class="btn btn-cyber" (click)="selectMode('security')">
            <div class="btn-icon"><i class="fas fa-shield-alt"></i></div>
            <div class="btn-content">
              <span class="btn-title">Security</span>
              <span class="btn-subtitle">Cybersecurity & Ethical Hacking</span>
            </div>
          </button>
          <button class="btn btn-sde" (click)="selectMode('sde')">
            <div class="btn-icon"><i class="fas fa-laptop-code"></i></div>
            <div class="btn-content">
              <span class="btn-title">Engineering</span>
              <span class="btn-subtitle">Software Development & Architecture</span>
            </div>
          </button>
        </div>

        <div class="quick-links">
          <a routerLink="/about" class="quick-link"><i class="fas fa-user"></i> About Me</a>
          <a routerLink="/contact" class="quick-link"><i class="fas fa-envelope"></i> Contact</a>
          <a routerLink="/links" class="quick-link"><i class="fas fa-link"></i> Resources</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .landing-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      width: 100%;
      background: linear-gradient(135deg, #050505 0%, #0a0e27 100%);
      color: #fff;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      position: relative;
      z-index: 1;
      padding-top: 70px;
      padding-bottom: 20px;
    }

    @media (max-width: 768px) {
      .landing-container {
        padding-top: 60px;
        padding-bottom: 80px;
        padding-left: 10px;
        padding-right: 10px;
      }

      .choice-box {
        padding: 2rem 1.5rem;
        max-width: 100%;
      }

      .buttons {
        flex-direction: column;
        gap: 1rem;
      }

      .btn {
        min-width: 100%;
        padding: 1.25rem 1.5rem;
      }

      .name-title {
        font-size: 2rem;
      }

      .selection-title {
        font-size: 1.25rem;
      }

      .quick-links {
        flex-direction: column;
        gap: 0.75rem;
      }
    }

    @media (max-width: 480px) {
      .landing-container {
        padding-top: 60px;
        padding-bottom: 80px;
        padding-left: 15px;
        padding-right: 15px;
      }

      .choice-box {
        padding: 1.5rem 1rem;
      }

      .name-title {
        font-size: 1.75rem;
      }

      .tagline {
        font-size: 0.9rem;
      }

      .logo-icon {
        font-size: 2.5rem;
      }
    }
    .choice-box {
      text-align: center;
      padding: 3rem;
      background: rgba(10, 14, 39, 0.9);
      border: 1px solid rgba(0, 255, 65, 0.2);
      border-radius: 16px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(0, 255, 65, 0.1);
      max-width: 500px;
      animation: fadeInUp 0.8s ease-out;
    }
    .logo-header {
      margin-bottom: 2.5rem;
    }
    .logo-icon {
      font-size: 3rem;
      color: #00ff41;
      margin-bottom: 1rem;
      text-shadow: 0 0 20px rgba(0, 255, 65, 0.5);
      animation: pulse 2s ease-in-out infinite;
    }
    .name-title {
      font-size: 2.5rem;
      font-weight: 800;
      margin-bottom: 0.5rem;
      background: linear-gradient(135deg, #00ff41 0%, #00d4ff 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .tagline {
      font-size: 1rem;
      color: #94a3b8;
      margin-bottom: 2rem;
    }
    .selection-title {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 2rem;
      color: #e2e8f0;
    }
    .buttons {
      display: flex;
      gap: 1.5rem;
      justify-content: center;
      flex-wrap: wrap;
      margin-bottom: 2rem;
    }
    .btn {
      background: rgba(15, 23, 42, 0.8);
      border: 2px solid;
      border-radius: 12px;
      padding: 1.5rem 2rem;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
      min-width: 180px;
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
    .btn:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }
    .btn-icon {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }
    .btn-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;
    }
    .btn-title {
      font-size: 1.2rem;
      font-weight: 700;
    }
    .btn-subtitle {
      font-size: 0.8rem;
      opacity: 0.8;
      text-align: center;
    }
    .btn-cyber {
      border-color: #00ff41;
      color: #00ff41;
    }
    .btn-cyber:hover {
      background: rgba(0, 255, 65, 0.1);
      box-shadow: 0 10px 30px rgba(0, 255, 65, 0.3);
    }
    .btn-sde {
      border-color: #00d4ff;
      color: #00d4ff;
    }
    .btn-sde:hover {
      background: rgba(0, 212, 255, 0.1);
      box-shadow: 0 10px 30px rgba(0, 212, 255, 0.3);
    }
    .quick-links {
      display: flex;
      gap: 1.5rem;
      justify-content: center;
      flex-wrap: wrap;
    }
    .quick-link {
      color: #94a3b8;
      text-decoration: none;
      font-size: 0.9rem;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      pointer-events: auto;
      cursor: pointer;
    }
    .quick-link:hover {
      color: #00ff41;
      background: rgba(0, 255, 65, 0.1);
    }
    .quick-link:active {
      transform: scale(0.95);
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

    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
        text-shadow: 0 0 20px rgba(0, 255, 65, 0.5);
      }
      50% {
        transform: scale(1.05);
        text-shadow: 0 0 30px rgba(0, 255, 65, 0.8);
      }
    }
  `]
})
export class LandingComponent {
  constructor(private modeService: ModeService, private router: Router) {}

  selectMode(mode: PortfolioMode) {
    this.modeService.setMode(mode);
    this.router.navigate([`/${mode}`]);
  }
}
