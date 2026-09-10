import { Injectable, signal } from '@angular/core';

export type PortfolioMode = 'sde' | 'security' | null;

@Injectable({
  providedIn: 'root'
})
export class ModeService {
  private readonly MODE_KEY = 'portfolio_mode';
  
  // Use a signal for reactive state
  public readonly currentMode = signal<PortfolioMode>(this.getStoredMode());

  constructor() {}

  private getStoredMode(): PortfolioMode {
    try {
      const stored = localStorage.getItem(this.MODE_KEY);
      if (stored === 'sde' || stored === 'security') {
        return stored as PortfolioMode;
      }
    } catch (e) {
      console.warn('localStorage not accessible', e);
    }
    return null;
  }

  public setMode(mode: PortfolioMode): void {
    this.currentMode.set(mode);
    try {
      if (mode) {
        localStorage.setItem(this.MODE_KEY, mode);
      } else {
        localStorage.removeItem(this.MODE_KEY);
      }
    } catch (e) {
      console.warn('localStorage not accessible', e);
    }
  }
}
