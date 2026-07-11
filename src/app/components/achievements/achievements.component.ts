import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, Achievement } from '../../services/data.service';
import { AdminService } from '../../services/admin.service';
import { AdminOnlyDirective } from '../../directives/admin-only.directive';

@Component({
  selector: 'app-achievements',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminOnlyDirective],
  templateUrl: './achievements.component.html',
  styleUrls: ['./achievements.component.css']
})
export class AchievementsComponent implements OnInit {
  showAddForm = false;
  newAch: Omit<Achievement, 'id'> = {
    title: '',
    description: '',
    imageUrl: '',
    date: new Date().toISOString().split('T')[0]
  };

  achievements$ = this.dataService.achs$;
  selectedImage: string | null = null;

  constructor(
    public dataService: DataService,
    public adminService: AdminService
  ) {}

  ngOnInit(): void {}

  openImage(url: string | undefined): void {
    if (url) {
      this.selectedImage = url;
    }
  }

  closeImage(): void {
    this.selectedImage = null;
  }

  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.newAch.imageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  addAchievement() {
    if (this.newAch.title) {
      this.dataService.addAchievement(this.newAch);
      this.resetForm();
      this.showAddForm = false;
    }
  }

  deleteAchievement(id: string) {
    if (confirm('Delete this achievement?')) {
      this.dataService.deleteAchievement(id);
    }
  }

  resetForm() {
    this.newAch = {
      title: '',
      description: '',
      imageUrl: '',
      date: new Date().toISOString().split('T')[0]
    };
  }
}
