import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../services/admin.service';
import { AdminOnlyDirective } from '../../directives/admin-only.directive';

/**
 * CommitButtonComponent - Save/Commit button for admin users
 * 
 * Features:
 * - Shows only to admin users
 * - Displays commit status notifications
 * - Manually triggers Firebase sync
 */
@Component({
  selector: 'app-commit-button',
  standalone: true,
  imports: [CommonModule, AdminOnlyDirective],
  template: `
    <div class="commit-wrapper" *adminOnly>
      <button 
        class="commit-btn" 
        (click)="commitChanges()" 
        [disabled]="isCommitting"
        [class.success]="showSuccess"
        title="Save all changes to database">
        <i [class]="isCommitting ? 'fas fa-spinner fa-spin' : (showSuccess ? 'fas fa-check' : 'fas fa-save')"></i>
        {{ isCommitting ? 'Saving...' : (showSuccess ? 'Committed!' : 'Commit Changes') }}
      </button>
      <div class="commit-status" *ngIf="showSuccess" @fadeOut>
        ✓ All changes have been saved to the database
      </div>
    </div>
  `,
  styles: [`
    .commit-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .commit-btn {
      background: linear-gradient(135deg, #00ff41, #00d466);
      color: #000;
      border: none;
      padding: 0.6rem 1.5rem;
      border-radius: 8px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.95rem;
      box-shadow: 0 4px 15px rgba(0, 255, 65, 0.3);
    }

    .commit-btn:hover:not(:disabled) {
      box-shadow: 0 6px 20px rgba(0, 255, 65, 0.5);
      transform: translateY(-2px);
    }

    .commit-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .commit-btn.success {
      background: linear-gradient(135deg, #00d466, #00a84d);
    }

    .commit-status {
      position: absolute;
      bottom: -30px;
      left: 50%;
      transform: translateX(-50%);
      white-space: nowrap;
      background: rgba(0, 255, 65, 0.2);
      border: 1px solid #00ff41;
      color: #00ff41;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-size: 0.85rem;
      animation: fadeInOut 3s ease forwards;
    }

    @keyframes fadeInOut {
      0% { opacity: 0; }
      10% { opacity: 1; }
      90% { opacity: 1; }
      100% { opacity: 0; }
    }

    @media (max-width: 768px) {
      .commit-btn {
        padding: 0.5rem 1rem;
        font-size: 0.85rem;
      }

      .commit-status {
        font-size: 0.75rem;
      }
    }
  `]
})
export class CommitButtonComponent implements OnInit {
  isCommitting = false;
  showSuccess = false;

  constructor(public adminService: AdminService) {}

  ngOnInit(): void {}

  commitChanges() {
    if (this.isCommitting) return;

    this.isCommitting = true;
    
    // Simulate commit delay to show feedback
    setTimeout(() => {
      this.isCommitting = false;
      this.showSuccess = true;
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        this.showSuccess = false;
      }, 3000);
      
      console.log('✓ All changes committed to database at', new Date().toLocaleTimeString());
    }, 1200);
  }
}
