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

/**
 * Admin authentication & session management [SECURITY 3.2]
 * - Real Firebase Auth integration
 * - browserSessionPersistence (session ends when tab closes)
 * - Admin verification via verified email / custom claim (admin: true)
 * - No hardcoded admin email or passwords in bundle
 */
@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private _isAdmin = new BehaviorSubject<boolean>(false);
  public isAdmin$: Observable<boolean> = this._isAdmin as any;
  private _currentUser = new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> = this._currentUser as any;

  constructor(private firebaseApp: FirebaseAppService) {
    const auth = this.firebaseApp.auth;

    // Explicitly configure browserSessionPersistence so sessions end on tab close
    setPersistence(auth, browserSessionPersistence).catch(err => {
      console.warn('Could not set browserSessionPersistence on auth:', err);
    });

    // Listen to token changes (fires on sign-in, sign-out, and token refresh)
    onIdTokenChanged(auth, (user: User | null) => {
      void this.updateAdminState(user, false);
    });
  }

  private withTimeout<T>(p: Promise<T>, ms = 15000): Promise<T> {
    return Promise.race([
      p,
      new Promise<never>((_, rej) => setTimeout(() => rej(new Error('LOGIN_TIMEOUT')), ms)),
    ]);
  }

  private async updateAdminState(user: User | null, forceRefresh = false): Promise<boolean> {
    this._currentUser.next(user);
    if (user) {
      if (!user.emailVerified) {
        console.warn('Admin login blocked: Email not verified.');
        this._isAdmin.next(false);
        return false;
      }
      try {
        const tokenResult = await user.getIdTokenResult(forceRefresh);
        const isAdmin = tokenResult.claims['admin'] === true;
        if (!isAdmin) {
          console.warn('User authenticated, but lacks admin custom claim.');
        }
        this._isAdmin.next(isAdmin);
        return isAdmin;
      } catch (err) {
        console.error('Failed to fetch token claims:', err);
        this._isAdmin.next(false);
        return false;
      }
    } else {
      this._isAdmin.next(false);
      return false;
    }
  }

  public get isAdmin(): boolean {
    return this._isAdmin.getValue();
  }

  public get currentUser(): User | null {
    return this._currentUser.getValue();
  }

  /**
   * Real login with email and password via Firebase Auth with timeout protection.
   */
  public async login(param1: string, param2?: string): Promise<boolean> {
    let email = '';
    let password = '';

    if (param2 !== undefined) {
      if (param1.includes('@')) {
        email = param1;
        password = param2;
      } else {
        password = param1;
        email = param2;
      }
    } else if (param1.includes(':')) {
      const parts = param1.split(':');
      email = parts[0];
      password = parts.slice(1).join(':');
    } else if (param1.includes(' ')) {
      const parts = param1.trim().split(/\s+/);
      email = parts[0];
      password = parts.slice(1).join(' ');
    } else {
      console.warn('Admin login requires email and password.');
      return false;
    }

    if (!email || !password) {
      console.warn('Admin login requires valid non-empty email and password.');
      return false;
    }

    try {
      const cred = await this.withTimeout(
        signInWithEmailAndPassword(this.firebaseApp.auth, email.trim(), password)
      );
      const user = cred.user;

      if (!user.emailVerified) {
        await signOut(this.firebaseApp.auth);
        throw new Error('Please verify your email address before logging into the admin panel.');
      }

      return await this.updateAdminState(user, true);
    } catch (err: any) {
      if (err?.message === 'LOGIN_TIMEOUT') {
        console.warn('Login timed out: Network or security check failed. Please try again.');
      } else {
        console.error('Admin login authentication error:', err);
      }
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
