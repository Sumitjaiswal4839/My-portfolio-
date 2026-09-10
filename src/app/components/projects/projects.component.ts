import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ProjectService, Project } from '../../services/project.service';
import { AdminOnlyDirective } from '../../directives/admin-only.directive';
import { AdminService } from '../../services/admin.service';
import { ModeService } from '../../core/services/mode.service';
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

  public isSdeMode = true;

  // Filter projects strictly based on current mode [SDE vs Cybersecurity segregation]
  projects$ = this.projectService.projects$;
  filteredProjects$ = this.projects$.pipe(
    map(projects => {
      if (this.isSdeMode) {
        // Only SDE / normal software engineering projects
        return projects.filter(p => p.type === 'normal');
      } else {
        // Only Cybersecurity projects
        return projects.filter(p => p.type === 'cyber');
      }
    })
  );

  showAddForm = false;
  isEditing = false;
  editingId = '';
  isSaving = false;

  newProject: Omit<Project, 'id'> = {
    title: '',
    type: 'normal',
    liveLink: '',
    githubLink: '',
    description: ''
  };

  ngOnInit(): void {
    const url = this.router.url;
    if (url.includes('/security')) {
      this.isSdeMode = false;
    } else {
      this.isSdeMode = this.modeService.currentMode() !== 'security';
    }

    this.newProject.type = this.isSdeMode ? 'normal' : 'cyber';
  }

  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) {
      this.resetForm();
    }
  }

  onSubmit() {
    if (this.newProject.title && this.newProject.description) {
      this.isSaving = true;
      this.newProject.type = this.isSdeMode ? 'normal' : 'cyber';
      
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

  resetForm() {
    this.isEditing = false;
    this.editingId = '';
    this.newProject = {
      title: '',
      type: this.isSdeMode ? 'normal' : 'cyber',
      liveLink: '',
      githubLink: '',
      description: ''
    };
  }
}
