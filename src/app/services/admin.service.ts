import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User
} from 'firebase/auth';
import { environment } from '../../environments/environment';

const ADMIN_EMAIL = 'sj0269950@gmail.com'; // same email as in firestore.rules

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private auth = getAuth(initializeApp(environment.firebase));
  private _isAdmin = new BehaviorSubject<boolean>(false);
  isAdmin$: Observable<boolean> = this._isAdmin.asObservable();

  constructor() {
    onAuthStateChanged(this.auth, (user: User | null) => {
      this._isAdmin.next(!!user && user.email === ADMIN_EMAIL);
    });
  }

  get isAdmin(): boolean {
    return this._isAdmin.getValue();
  }

  async login(email: string, password: string): Promise<boolean> {
    try {
      const cred = await signInWithEmailAndPassword(this.auth, email, password);
      return cred.user.email === ADMIN_EMAIL;
    } catch (err) {
      console.error('Login failed', err);
      return false;
    }
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
  }
}
