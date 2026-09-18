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

  private async updateAdminState(user: User | null): Promise<void> {
    this._currentUser.next(user);
    if (user) {
      if (!user.emailVerified) {
        console.warn('Admin login blocked: Email not verified.');
        this._isAdmin.next(false);
        return;
      }
      try {
        const tokenResult = await user.getIdTokenResult(true);
        if (tokenResult.claims['admin'] === true) {
          this._isAdmin.next(true);
        } else {
          console.warn('User authenticated, but lacks admin custom claim.');
          this._isAdmin.next(false);
        }
      } catch (err) {
        console.error('Failed to fetch token claims:', err);
        this._isAdmin.next(false);
      }
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
      const user = cred.user;

      if (!user.emailVerified) {
        // Sign out if email is not verified
        await signOut(this.firebaseApp.auth);
        throw new Error('Please verify your email address before logging into the admin panel.');
      }

      // updateAdminState will handle the true logic asynchronously.
      // But we can optimistically wait for token result here to return true/false correctly
      const tokenResult = await user.getIdTokenResult(true);
      const isAuthAdmin = tokenResult.claims['admin'] === true;
      
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
