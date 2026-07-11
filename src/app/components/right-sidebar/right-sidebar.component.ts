import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-right-sidebar',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './right-sidebar.component.html',
    styleUrls: ['./right-sidebar.component.css']
})
export class RightSidebarComponent {
    isExpanded = signal(false);
    activeModal = signal<string | null>(null);

    toggleSidebar(): void {
        this.isExpanded.update(v => !v);
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
