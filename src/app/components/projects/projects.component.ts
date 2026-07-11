import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectService, Project } from '../../services/project.service';
import { AdminOnlyDirective } from '../../directives/admin-only.directive';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminOnlyDirective],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent implements OnInit {
  projects$ = this.projectService.projects$;
  projects: Project[] = [];
  filteredProjects: Project[] = [];
  activeTab: 'cyber' | 'normal' | 'all' = 'all';
  showAddForm = false;
  isEditing = false;
  editingId = '';
  isSaving = false;

  newProject: Omit<Project, 'id'> = {
    title: '',
    type: 'cyber',
    liveLink: '',
    githubLink: '',
    description: ''
  };

  constructor(
    private projectService: ProjectService,
    public adminService: AdminService
  ) {
    this.projects$.subscribe(projects => {
      this.projects = projects;
      this.filterProjects(this.activeTab);
    });
  }

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects() {
    this.projects = this.projectService.getProjects();
    this.filterProjects(this.activeTab);
  }

  filterProjects(type: 'cyber' | 'normal' | 'all') {
    this.activeTab = type;
    if (type === 'all') {
      this.filteredProjects = this.projects;
    } else {
      this.filteredProjects = this.projects.filter(p => p.type === type);
    }
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
      
      if (this.isEditing) {
        this.projectService.updateProject(this.editingId, this.newProject);
      } else {
        this.projectService.addProject(this.newProject);
      }
      
      setTimeout(() => {
        this.isSaving = false;
        this.loadProjects();
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
      this.loadProjects();
    }
  }

  resetForm() {
    this.isEditing = false;
    this.editingId = '';
    this.newProject = {
      title: '',
      type: 'cyber',
      liveLink: '',
      githubLink: '',
      description: ''
    };
  }
}
