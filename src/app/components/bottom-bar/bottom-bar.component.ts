import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-bottom-bar',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './bottom-bar.component.html',
    styleUrls: ['./bottom-bar.component.css']
})
export class BottomBarComponent {
    // Bar state
    isBarExpanded = signal(false);
    activeModal = signal<string | null>(null);

    toggleBar(): void {
        this.isBarExpanded.update(v => !v);
    }

    openModal(modalId: string): void {
        this.activeModal.set(modalId);
    }

    closeModal(): void {
        this.activeModal.set(null);
    }

    openImage(url: string): void {
        window.open(url, '_blank');
    }
}
