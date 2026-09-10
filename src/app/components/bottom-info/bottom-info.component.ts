import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ModeService } from '../../core/services/mode.service';

@Component({
    selector: 'app-bottom-info',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './bottom-info.component.html',
    styleUrls: ['./bottom-info.component.css']
})
export class BottomInfoComponent implements OnInit {
    modeService = inject(ModeService);

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
}
