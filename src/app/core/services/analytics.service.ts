import { Injectable } from '@angular/core';
import { logEvent } from 'firebase/analytics';
import { FirebaseAppService } from './firebase-app.service';

export interface PortfolioAnalyticsSummary {
  securityViews: number;
  sdeViews: number;
  securityResumeDownloads: number;
  sdeResumeDownloads: number;
  securityResumePreviews: number;
  sdeResumePreviews: number;
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private readonly STATS_STORAGE_KEY = 'portfolio_analytics_metrics';

  constructor(private firebaseApp: FirebaseAppService) {}

  /**
   * Track which mode was viewed (Security vs SDE)
   */
  public trackModeView(mode: 'security' | 'sde'): void {
    this.sendEvent('mode_view', {
      mode,
      page_path: `/${mode}`,
      timestamp: new Date().toISOString()
    });
    this.incrementMetric(mode === 'security' ? 'securityViews' : 'sdeViews');
  }

  /**
   * Track resume download per mode
   */
  public trackResumeDownload(mode: 'security' | 'sde'): void {
    this.sendEvent('resume_download', {
      mode,
      file_type: 'pdf',
      timestamp: new Date().toISOString()
    });
    this.incrementMetric(mode === 'security' ? 'securityResumeDownloads' : 'sdeResumeDownloads');
  }

  /**
   * Track resume preview per mode
   */
  public trackResumePreview(mode: 'security' | 'sde'): void {
    this.sendEvent('resume_preview', {
      mode,
      timestamp: new Date().toISOString()
    });
    this.incrementMetric(mode === 'security' ? 'securityResumePreviews' : 'sdeResumePreviews');
  }

  /**
   * Track contact submission
   */
  public trackContactSubmission(method: string = 'whatsapp'): void {
    this.sendEvent('contact_submit', {
      method,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Send event to Firebase Analytics & window.gtag
   */
  private sendEvent(eventName: string, params?: Record<string, any>): void {
    try {
      if (this.firebaseApp.analytics) {
        logEvent(this.firebaseApp.analytics, eventName, params);
      }
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', eventName, params);
      }
    } catch {
      // Analytics failures should never crash application operations
    }
  }

  private incrementMetric(field: keyof PortfolioAnalyticsSummary): void {
    try {
      if (typeof window === 'undefined') return;
      const current = this.getSummary();
      current[field] = (current[field] || 0) + 1;
      localStorage.setItem(this.STATS_STORAGE_KEY, JSON.stringify(current));
    } catch {}
  }

  public getSummary(): PortfolioAnalyticsSummary {
    try {
      if (typeof window === 'undefined') {
        return this.getEmptySummary();
      }
      const raw = localStorage.getItem(this.STATS_STORAGE_KEY);
      if (raw) {
        return { ...this.getEmptySummary(), ...JSON.parse(raw) };
      }
    } catch {}
    return this.getEmptySummary();
  }

  private getEmptySummary(): PortfolioAnalyticsSummary {
    return {
      securityViews: 0,
      sdeViews: 0,
      securityResumeDownloads: 0,
      sdeResumeDownloads: 0,
      securityResumePreviews: 0,
      sdeResumePreviews: 0
    };
  }
}
