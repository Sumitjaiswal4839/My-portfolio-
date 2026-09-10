import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminService } from './admin.service';

/**
 * Proxy / Compatibility layer delegating to AdminService [SECURITY 3.2]
 * Hardcoded passwords and localStorage flags have been completely removed.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private adminService: AdminService) {}

  get isAdmin$(): Observable<boolean> {
    return this.adminService.isAdmin$;
  }

  get isAdmin(): boolean {
    return this.adminService.isAdmin;
  }

  async login(password: string): Promise<boolean> {
    return this.adminService.login(password);
  }

  async logout(): Promise<void> {
    return this.adminService.logout();
  }
}
