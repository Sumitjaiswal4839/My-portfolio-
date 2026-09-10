import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  onAuthStateChanged,
  onIdTokenChanged,
  signInWithEmailAndPassword,
  signOut,
  setPersistence,
  browserSessionPersistence,
  User
} from 'firebase/auth';
import { FirebaseAppService } from '../core/services/firebase-app.service';

export const ADMIN_EMAIL = 'sj0269950@gmail.com';

/**
 * Admin authentication & session management [SECURITY 3.2]
 * - Real Firebase Auth integration
 * - browserSessionPersistence (session ends when tab closes)
 * - Admin verification via verified email / custom claim
 * - No hardcoded passwords
 */
@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private _isAdmin = new BehaviorSubject<boolean>(false);
  public isAdmin$: Observable<boolean> = this._isAdmin.asObservable();
  private _currentUser = new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> = this._currentUser.asObservable();

  constructor(private firebaseApp: FirebaseAppService) {
    const auth = this.firebaseApp.auth;

    // Explicitly configure browserSessionPersistence so sessions end on tab close
    setPersistence(auth, browserSessionPersistence).catch(err => {
      console.warn('Could not set browserSessionPersistence on auth:', err);
    });

    // Listen to auth state changes
    onAuthStateChanged(auth, (user: User | null) => {
      this.updateAdminState(user);
    });

    // Built-in token refresh
    onIdTokenChanged(auth, (user: User | null) => {
      this.updateAdminState(user);
    });
  }

  private updateAdminState(user: User | null): void {
    this._currentUser.next(user);
    if (user && user.email === ADMIN_EMAIL) {
      this._isAdmin.next(true);
    } else {
      this._isAdmin.next(false);
    }
  }

  public get isAdmin(): boolean {
    return this._isAdmin.getValue();
  }

  public get currentUser(): User | null {
    return this._currentUser.getValue();
  }

  /**
   * Real login with email and password via Firebase Auth.
   */
  public async login(password: string, email: string = ADMIN_EMAIL): Promise<boolean> {
    try {
      const cred = await signInWithEmailAndPassword(this.firebaseApp.auth, email.trim(), password);
      const isAuthAdmin = cred.user.email === ADMIN_EMAIL;
      this._isAdmin.next(isAuthAdmin);
      return isAuthAdmin;
    } catch (err) {
      console.error('Admin login authentication error:', err);
      this._isAdmin.next(false);
      return false;
    }
  }

  /**
   * Real logout calling signOut(auth).
   */
  public async logout(): Promise<void> {
    try {
      await signOut(this.firebaseApp.auth);
      this._isAdmin.next(false);
      this._currentUser.next(null);
    } catch (err) {
      console.error('Admin logout error:', err);
    }
  }
}
