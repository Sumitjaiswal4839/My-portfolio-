import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAdminSubject = new BehaviorSubject<boolean>(false);
  isAdmin$ = this.isAdminSubject.asObservable();

  constructor() {
    // Optional: Keep admin state on refresh for local dev/demo
    const saved = localStorage.getItem('is_admin');
    if (saved === 'true') {
      this.isAdminSubject.next(true);
    }
  }

  get isAdmin(): boolean {
    return this.isAdminSubject.value;
  }

  login(password: string): boolean {
    if (password === 'REDACTED') {
      this.isAdminSubject.next(true);
      localStorage.setItem('is_admin', 'true');
      return true;
    }
    return false;
  }

  logout() {
    this.isAdminSubject.next(false);
    localStorage.removeItem('is_admin');
  }
}
