import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * AdminService - Manages owner authentication state
 * 
 * Features:
 * - Tracks admin/owner login status
 * - Persists state in sessionStorage (clears when tab closes)
 * - Used by *adminOnly directive to show/hide sensitive buttons
 */
@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private _isAdmin = new BehaviorSubject<boolean>(false);
  isAdmin$ = this._isAdmin.asObservable();

  constructor() {
    this.checkSession();
  }

  get isAdmin(): boolean {
    return this._isAdmin.getValue();
  }

  /**
   * Activate admin mode (after correct password)
   */
  activate(): void {
    this._isAdmin.next(true);
    sessionStorage.setItem('__portfolio_root', 'true');
  }

  /**
   * Deactivate admin mode (logout)
   */
  deactivate(): void {
    this._isAdmin.next(false);
    sessionStorage.removeItem('__portfolio_root');
  }

  /**
   * Check if session still valid (on page refresh)
   */
  checkSession(): void {
    if (sessionStorage.getItem('__portfolio_root') === 'true') {
      this._isAdmin.next(true);
    }
  }
}
