import { Directive, TemplateRef, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AdminService } from '../services/admin.service';

/**
 * *adminOnly Structural Directive
 * 
 * Usage: <button *adminOnly>Upload Resume</button>
 * 
 * The element is rendered ONLY when the owner is authenticated via REDACTED
 * For all regular visitors, the element is completely removed from the DOM.
 * 
 * This is more secure than just hiding with CSS, as the buttons don't exist in the DOM.
 */
@Directive({
  selector: '[adminOnly]',
  standalone: true
})
export class AdminOnlyDirective implements OnInit, OnDestroy {
  private subscription: Subscription | null = null;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private adminService: AdminService
  ) {
    // Initially HIDE the element
    this.viewContainer.clear();
  }

  ngOnInit(): void {
    // Check initial state
    this.updateView(this.adminService.isAdmin);

    // Subscribe to future changes
    this.subscription = this.adminService.isAdmin$.subscribe((isAdmin: boolean) => {
      this.updateView(isAdmin);
    });
  }

  private updateView(isAdmin: boolean): void {
    this.viewContainer.clear();
    if (isAdmin === true) {
      // Only render if explicitly authenticated
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
