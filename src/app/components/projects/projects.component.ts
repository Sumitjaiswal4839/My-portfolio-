import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProjectService, Project } from '../../services/project.service';
import { AdminOnlyDirective } from '../../directives/admin-only.directive';
import { AdminService } from '../../services/admin.service';
import { AuthService } from '../../services/auth.service';
import { BehaviorSubject, combineLatest, map } from 'rxjs';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AdminOnlyDirective],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent implements OnInit {
  projects$ = this.projectService.projects$;
  activeTabSubject = new BehaviorSubject<'cyber' | 'normal' | 'all'>('all');
  activeTab$ = this.activeTabSubject.asObservable();
  
  filteredProjects$ = combineLatest([this.projects$, this.activeTab$]).pipe(
    map(([projects, tab]) => {
      if (tab === 'all') return projects;
      return projects.filter(p => p.type === tab);
    })
  );

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
  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects() {
    this.projectService.getProjects(); // If it fetches, let it fetch
  }

  filterProjects(type: 'cyber' | 'normal' | 'all') {
    this.activeTab = type;
    this.activeTabSubject.next(type);
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
