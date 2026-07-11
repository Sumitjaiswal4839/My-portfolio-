import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  isDark = signal(true);

  toggleTheme(): void {
    this.isDark.update(v => !v);
    document.body.setAttribute('data-theme', this.isDark() ? 'dark' : 'light');
  }

  initTheme(): void {
    document.body.setAttribute('data-theme', 'dark');
  }
}
