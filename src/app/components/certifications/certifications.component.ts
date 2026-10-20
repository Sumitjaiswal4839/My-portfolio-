import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, Certification } from '../../services/data.service';
import { AdminService } from '../../services/admin.service';
import { AdminOnlyDirective } from '../../directives/admin-only.directive';
import { SafeUrlPipe } from '../../pipes/safe-url.pipe';
import { openFileSafely } from '../../utils/safe-open';

@Component({
  selector: 'app-certifications',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminOnlyDirective, SafeUrlPipe],
  templateUrl: './certifications.component.html',
  styleUrls: ['./certifications.component.css']
})
export class CertificationsComponent implements OnInit {
  showAddForm = false;
  isEditing = false;
  editingId = '';
  newCert: Omit<Certification, 'id'> = {
    title: '',
    description: '',
    fileUrl: '',
    fileType: '',
    date: new Date().toISOString().split('T')[0]
  };

  certifications$ = this.dataService.certs$;

  constructor(
    public dataService: DataService,
    public adminService: AdminService
  ) {}

  ngOnInit(): void {}

  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
  }

  onFileSelected(event: any) {
    const file = event.target.files?.[0];
    if (!file) return;

    const MAX = 700 * 1024;
    if (file.size > MAX) {
      alert('File size exceeds 700 KB limit. Please upload a smaller compressed document.');
      return;
    }
    const allowed = ['application/pdf', 'image/png', 'image/jpeg', 'image/webp'];
    if (!allowed.includes(file.type)) {
      alert('Only PDF, PNG, JPEG, or WEBP files are allowed.');
      return;
    }

    this.newCert.fileType = file.type.includes('pdf') ? 'pdf' : 'image';
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.newCert.fileUrl = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  addCertification() {
    if (this.newCert.title && this.newCert.fileUrl) {
      this.dataService.addCert(this.newCert);
      this.resetForm();
      this.showAddForm = false;
    }
  }

  deleteCertification(id: string) {
    if (confirm('Are you sure you want to delete this certification?')) {
      this.dataService.deleteCert(id);
    }
  }

  editCertification(cert: Certification) {
    this.isEditing = true;
    this.editingId = cert.id;
    this.newCert = { ...cert };
    this.showAddForm = true;
  }

  saveCertification() {
    if (this.isEditing) {
      this.dataService.updateCert(this.editingId, this.newCert);
    } else {
      this.dataService.addCert(this.newCert);
    }
    this.resetForm();
    this.showAddForm = false;
  }

  resetForm() {
    this.isEditing = false;
    this.editingId = '';
    this.newCert = {
      title: '',
      description: '',
      fileUrl: '',
      fileType: '',
      date: new Date().toISOString().split('T')[0]
    };
  }

  viewFile(target: Certification | string): void {
    const url = typeof target === 'string' ? target : target?.fileUrl;
    if (!openFileSafely(url)) {
      console.warn('Blocked or invalid file URL');
    }
  }
}
