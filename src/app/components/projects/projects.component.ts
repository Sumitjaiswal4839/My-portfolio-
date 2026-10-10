import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ProjectService, Project } from '../../services/project.service';
import { AdminOnlyDirective } from '../../directives/admin-only.directive';
import { AdminService } from '../../services/admin.service';
import { ModeService } from '../../core/services/mode.service';
import { DataService } from '../../services/data.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AdminOnlyDirective],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent implements OnInit {
  private projectService = inject(ProjectService);
  private modeService = inject(ModeService);
  private router = inject(Router);
  public adminService = inject(AdminService);
  private dataService = inject(DataService);

  public isSdeMode = true;
  selectedFileName: string = '';
  selectedFile: File | null = null;

  // Filter projects strictly based on current mode [SDE vs Cybersecurity segregation]
  projects$ = this.projectService.projects$;
  filteredProjects$ = this.projectService.getProjects(this.isSdeMode ? 'normal' : 'cyber');

  showAddForm = false;
  isEditing = false;
  editingId = '';
  isSaving = false;

  newProject: Omit<Project, 'id'> = {
    title: '',
    type: 'normal',
    liveLink: '',
    githubLink: '',
    description: '',
    cardDescription: '',
    fullDetails: '',
    detailsFileUrl: '',
    detailsFileType: 'text',
    pinned: false
  };

  ngOnInit(): void {
    const url = this.router.url;
    if (url.includes('/security')) {
      this.isSdeMode = false;
    } else {
      this.isSdeMode = this.modeService.currentMode() !== 'security';
    }

    this.newProject.type = this.isSdeMode ? 'normal' : 'cyber';
    this.filteredProjects$ = this.projectService.getProjects(this.isSdeMode ? 'normal' : 'cyber');
  }

  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) {
      this.resetForm();
    }
  }

  async onSubmit() {
    if (this.newProject.title && this.newProject.description) {
      this.isSaving = true;
      this.newProject.type = this.isSdeMode ? 'normal' : 'cyber';

      console.log('Submitting project:', this.newProject);
      console.log('Selected file:', this.selectedFile);
      console.log('Details file type:', this.newProject.detailsFileType);

      // Handle file upload if selected
      if (this.selectedFile && this.newProject.detailsFileType === 'file') {
        try {
          console.log('Starting file upload...');
          const fileUrl = await this.uploadProjectFile(this.selectedFile);
          this.newProject.detailsFileUrl = fileUrl;
          this.newProject.detailsFileType = this.selectedFile.type === 'application/pdf' ? 'pdf' : 'docx';
          console.log('File uploaded successfully, URL:', fileUrl);
        } catch (error) {
          console.error('File upload error:', error);
          alert('File upload failed. Please try again.');
          this.isSaving = false;
          return;
        }
      }

      // If card description is empty, use first 150 chars of description
      if (!this.newProject.cardDescription && this.newProject.description) {
        this.newProject.cardDescription = this.newProject.description.substring(0, 150);
      }

      console.log('Final project data before save:', this.newProject);

      if (this.isEditing) {
        this.projectService.updateProject(this.editingId, this.newProject);
      } else {
        this.projectService.addProject(this.newProject);
      }

      setTimeout(() => {
        this.isSaving = false;
        this.toggleAddForm();
      }, 500);
    }
  }

  editProject(project: Project) {
    this.isEditing = true;
    this.editingId = project.id;
    this.newProject = { ...project };
    this.showAddForm = true;
  }

  deleteProject(id: string) {
    if (confirm('Are you sure you want to delete this project?')) {
      this.projectService.deleteProject(id);
    }
  }

  togglePin(project: Project) {
    this.projectService.togglePin(project);
  }

  resetForm() {
    this.isEditing = false;
    this.editingId = '';
    this.newProject = {
      title: '',
      type: this.isSdeMode ? 'normal' : 'cyber',
      liveLink: '',
      githubLink: '',
      description: '',
      cardDescription: '',
      fullDetails: '',
      detailsFileUrl: '',
      detailsFileType: 'text',
      pinned: false
    };
    this.selectedFileName = '';
    this.selectedFile = null;
  }

  onFileSelected(event: any) {
    const file = event.target.files?.[0];
    if (file) {
      console.log('File selected:', file.name, file.type, file.size);

      // Validate file type
      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload only PDF or DOCX files.');
        return;
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('File size exceeds 5MB limit. Please upload a smaller file.');
        return;
      }

      this.selectedFile = file;
      this.selectedFileName = file.name;
      this.newProject.detailsFileType = 'file';
      console.log('File stored, detailsFileType set to:', this.newProject.detailsFileType);
    }
  }

  removeFile() {
    this.selectedFile = null;
    this.selectedFileName = '';
  }

  clearFileInput() {
    this.selectedFile = null;
    this.selectedFileName = '';
  }

  clearTextInput() {
    this.newProject.fullDetails = '';
  }

  async uploadProjectFile(file: File): Promise<string> {
    try {
      const fileUrl = await this.dataService.uploadProjectFile(file);
      return fileUrl;
    } catch (error) {
      console.error('File upload failed:', error);
      throw error;
    }
  }
}
