import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminOnlyDirective } from '../../directives/admin-only.directive';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminOnlyDirective],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  formData = {
    name: '',
    email: '',
    message: ''
  };

  submitted = signal(false);
  submitting = signal(false);
  uploadSuccess = signal(false);

  constructor(public adminService: AdminService) {}

  onSubmit(): void {
    if (!this.formData.name || !this.formData.email || !this.formData.message) return;
    this.submitting.set(true);

    // WhatsApp number (international format, no + or spaces)
    const phone = '917827584476'; // +91 7827584476

    const text = `*New Message from Portfolio*%0A%0A` +
      `*Name:* ${encodeURIComponent(this.formData.name)}%0A` +
      `*Email:* ${encodeURIComponent(this.formData.email)}%0A%0A` +
      `*Message:*%0A${encodeURIComponent(this.formData.message)}`;

    const waUrl = `https://wa.me/${phone}?text=${text}`;

    setTimeout(() => {
      this.submitting.set(false);
      this.submitted.set(true);
      window.open(waUrl, '_blank');
      this.formData = { name: '', email: '', message: '' };
    }, 800);
  }

  resetForm(): void {
    this.submitted.set(false);
  }

  uploadResume(): void {
    // Simulate file upload
    console.log('Resume upload initiated...');
    this.uploadSuccess.set(true);
    setTimeout(() => {
      this.uploadSuccess.set(false);
    }, 3000);
  }

  infoCards = [
    { icon: 'fas fa-envelope', title: 'Email', value: 'sj0269950@gmail.com' },
    { icon: 'fas fa-phone', title: 'Phone', value: '+91 7827584476' },
    { icon: 'fab fa-whatsapp', title: 'WhatsApp', value: 'Quick Chat' },
    { icon: 'fas fa-map-marker-alt', title: 'Location', value: 'Faridabad (Haryana)' }
  ];
}
