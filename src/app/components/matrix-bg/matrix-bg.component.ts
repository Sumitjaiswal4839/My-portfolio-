import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-matrix-bg',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="hacker-bg"></div>`,
  styles: [`
    .hacker-bg {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url('/assets/hacker_bg.png') no-repeat center center;
      background-size: cover;
      z-index: 0;
      opacity: 0.35; /* Keep it subtle so readability remains excellent */
      pointer-events: none;
    }
  `]
})
export class MatrixBgComponent {}
