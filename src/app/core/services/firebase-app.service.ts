import { Injectable } from '@angular/core';
import { initializeApp, FirebaseApp, getApps, getApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { initializeAppCheck, ReCaptchaV3Provider, AppCheck } from 'firebase/app-check';
import { getAnalytics, Analytics, isSupported } from 'firebase/analytics';
import { environment } from '../../../environments/environment';

/**
 * Single source of truth for Firebase initialization [SECURITY 3.1]
 * initializeApp() is called exactly once in this service.
 */
@Injectable({
  providedIn: 'root'
})
export class FirebaseAppService {
  public readonly app: FirebaseApp;
  public readonly db: Firestore;
  public readonly auth: Auth;
  public readonly storage: FirebaseStorage;
  public appCheck?: AppCheck;
  public analytics?: Analytics;

  constructor() {
    // Ensure initializeApp is called exactly once across the application
    if (getApps().length === 0) {
      this.app = initializeApp(environment.firebase);
    } else {
      this.app = getApp();
    }

    this.db = getFirestore(this.app);
    this.auth = getAuth(this.app);
    this.storage = getStorage(this.app);

    // Initialize App Check (reCAPTCHA v3) if in browser environment
    try {
      if (typeof window !== 'undefined' && (environment as any).recaptchaSiteKey) {
        if (!environment.production) {
          // Enable Debug mode for local development
          (self as any).FIREBASE_APP_CHECK_DEBUG_TOKEN = true;
        }
        this.appCheck = initializeAppCheck(this.app, {
          provider: new ReCaptchaV3Provider((environment as any).recaptchaSiteKey),
          isTokenAutoRefreshEnabled: true
        });
      }
    } catch (e) {
      console.warn('AppCheck initialization skipped or not configured:', e);
    }

    // Initialize Analytics if supported
    try {
      isSupported().then(supported => {
        if (supported) {
          this.analytics = getAnalytics(this.app);
        }
      }).catch(() => {});
    } catch (e) {
      // Analytics unsupported in non-browser/test environments
    }
  }
}
