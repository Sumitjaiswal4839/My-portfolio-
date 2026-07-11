import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, Certification } from '../../services/data.service';
import { AdminService } from '../../services/admin.service';
import { AdminOnlyDirective } from '../../directives/admin-only.directive';
import { SafeUrlPipe } from '../../pipes/safe-url.pipe';

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
    const file = event.target.files[0];
    if (file) {
      this.newCert.fileType = file.type.includes('pdf') ? 'pdf' : 'image';
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.newCert.fileUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
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

  viewFile(cert: Certification) {
    if (cert.fileType === 'pdf') {
      const win = window.open();
      if (win) {
        win.document.write(`<iframe src="${cert.fileUrl}" style="width:100%; height:100%; border:none;"></iframe>`);
      }
    } else {
        const win = window.open();
        if (win) {
          win.document.write(`<img src="${cert.fileUrl}" style="max-width:100%;">`);
        }
    }
  }
}
