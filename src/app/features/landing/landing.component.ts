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
        <h1 class="glitch-text" data-text="Which side do you want to see?">Which side do you want to see?</h1>
        <div class="buttons">
          <button class="btn btn-cyber" (click)="selectMode('security')">
            <span class="bracket">[</span> Cybersecurity <span class="bracket">]</span>
          </button>
          <button class="btn btn-sde" (click)="selectMode('sde')">
            <span class="bracket">[</span> Software Development (SDE) <span class="bracket">]</span>
          </button>
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
      width: 100vw;
      background-color: #050505;
      color: #fff;
      font-family: 'Courier New', Courier, monospace;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1000;
    }
    .choice-box {
      text-align: center;
      padding: 2rem;
      background: rgba(0, 0, 0, 0.8);
      border: 1px solid #333;
      border-radius: 8px;
      box-shadow: 0 0 20px rgba(0, 255, 0, 0.1);
    }
    h1 {
      font-size: 2rem;
      margin-bottom: 2rem;
      color: #0f0;
      text-shadow: 0 0 5px #0f0;
    }
    .buttons {
      display: flex;
      gap: 1.5rem;
      justify-content: center;
      flex-wrap: wrap;
    }
    .btn {
      background: transparent;
      border: none;
      color: inherit;
      font-family: inherit;
      font-size: 1.2rem;
      cursor: pointer;
      padding: 0.5rem 1rem;
      transition: all 0.3s ease;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }
    .btn:hover {
      text-shadow: 0 0 8px currentColor;
      transform: scale(1.05);
    }
    .bracket {
      opacity: 0.5;
    }
    .btn-cyber {
      color: #0f0;
    }
    .btn-sde {
      color: #00f0ff;
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
