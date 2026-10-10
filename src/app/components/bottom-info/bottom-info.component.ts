import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ModeService } from '../../core/services/mode.service';
import { ThemeService } from '../../services/theme.service';

@Component({
    selector: 'app-bottom-info',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './bottom-info.component.html',
    styleUrls: ['./bottom-info.component.css']
})
export class BottomInfoComponent implements OnInit {
    modeService = inject(ModeService);
    themeService = inject(ThemeService);
    
    mobileMenuOpen = signal(false);

    ngOnInit(): void {}

    getHomeLink(): string {
        const mode = this.modeService.currentMode();
        if (mode === 'sde') return '/sde';
        if (mode === 'security') return '/security';
        return '/';
    }

    getExperienceLink(): string {
        const mode = this.modeService.currentMode();
        if (mode === 'sde') return '/sde/experience';
        if (mode === 'security') return '/security/experience';
        return '/experience';
    }

    toggleMenu(): void {
        this.mobileMenuOpen.update(v => !v);
    }

    closeMenu(): void {
        this.mobileMenuOpen.set(false);
    }

    toggleTheme(): void {
        this.themeService.toggleTheme();
    }
}
