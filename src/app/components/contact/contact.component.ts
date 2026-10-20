import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminOnlyDirective } from '../../directives/admin-only.directive';
import { AdminService } from '../../services/admin.service';
import { AnalyticsService } from '../../core/services/analytics.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminOnlyDirective],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  formData = {
    name: '',
    email: '',
    message: ''
  };

  // Bot-protection fields
  honeypot = '';
  private formLoadedAt = Date.now();
  captchaVerified = signal(true);
  errorMessage = signal<string | null>(null);

  submitted = signal(false);
  submitting = signal(false);
  uploadSuccess = signal(false);

  constructor(
    public adminService: AdminService,
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit(): void {
    this.formLoadedAt = Date.now();
    this.loadRecaptchaScript();
  }

  private loadRecaptchaScript(): void {
    if (typeof window === 'undefined') return;
    const siteKey = (environment as any).recaptchaSiteKey;
    if (siteKey && !document.getElementById('recaptcha-script')) {
      const script = document.createElement('script');
      script.id = 'recaptcha-script';
      script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }

  async onSubmit(): Promise<void> {
    this.errorMessage.set(null);

    // 1. Basic validation
    if (!this.formData.name.trim() || !this.formData.email.trim() || !this.formData.message.trim()) {
      this.errorMessage.set('Please fill out all required fields.');
      return;
    }

    // 2. Honeypot check: Bots fill hidden inputs
    if (this.honeypot && this.honeypot.trim().length > 0) {
      console.warn('[Bot Prevention] Spam bot detected via honeypot trap.');
      this.errorMessage.set('Spam detection triggered. Please try again.');
      return;
    }

    // 3. Time-trap check: Bots submit instantly in < 1.2 seconds
    const elapsedMs = Date.now() - this.formLoadedAt;
    if (elapsedMs < 1200) {
      console.warn('[Bot Prevention] Suspicious automated submission speed.');
      this.errorMessage.set('Submission was too fast. Please take a moment and resubmit.');
      return;
    }

    this.submitting.set(true);

    // 4. Google reCAPTCHA v3 verification if key is present
    try {
      const siteKey = (environment as any).recaptchaSiteKey;
      if (typeof window !== 'undefined' && siteKey && (window as any).grecaptcha) {
        await new Promise<void>((resolve) => {
          (window as any).grecaptcha.ready(async () => {
            try {
              const token = await (window as any).grecaptcha.execute(siteKey, { action: 'submit_contact' });
              if (!token) {
                this.captchaVerified.set(false);
              }
            } catch (err) {
              console.warn('reCAPTCHA execution error:', err);
            }
            resolve();
          });
        });
      }
    } catch (e) {
      console.warn('reCAPTCHA verification skipped or failed', e);
    }

    // 5. Track contact event
    this.analyticsService.trackContactSubmission('whatsapp');

    // 6. WhatsApp Dispatch
    const phone = '917827584476';
    const text = `*New Message from Portfolio*%0A%0A` +
      `*Name:* ${encodeURIComponent(this.formData.name.trim())}%0A` +
      `*Email:* ${encodeURIComponent(this.formData.email.trim())}%0A%0A` +
      `*Message:*%0A${encodeURIComponent(this.formData.message.trim())}`;

    const waUrl = `https://wa.me/${phone}?text=${text}`;

    setTimeout(() => {
      this.submitting.set(false);
      this.submitted.set(true);
      window.open(waUrl, '_blank', 'noopener,noreferrer');
      this.formData = { name: '', email: '', message: '' };
    }, 600);
  }

  resetForm(): void {
    this.submitted.set(false);
    this.errorMessage.set(null);
    this.formLoadedAt = Date.now();
  }

  uploadResume(): void {
    console.warn('Resume upload feature is pending backend integration.');
    alert('Resume upload is managed from the Hero section options.');
  }

  infoCards = [
    { icon: 'fas fa-envelope', title: 'Email', value: 'sj0269950@gmail.com' },
    { icon: 'fas fa-phone', title: 'Phone', value: '+91 7827584476' },
    { icon: 'fab fa-whatsapp', title: 'WhatsApp', value: 'Quick Chat' },
    { icon: 'fas fa-map-marker-alt', title: 'Location', value: 'Faridabad (Haryana)' }
  ];
}
