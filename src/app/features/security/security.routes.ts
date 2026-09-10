import { Routes } from '@angular/router';

export const SECURITY_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./hero/hero.component').then(m => m.SecurityHeroComponent)
  },
  {
    path: 'certifications',
    loadComponent: () => import('../../components/certifications/certifications.component').then(m => m.CertificationsComponent)
  },
  {
    path: 'projects',
    loadComponent: () => import('../../components/projects/projects.component').then(m => m.ProjectsComponent)
  },
  {
    path: 'tools',
    loadComponent: () => import('../../components/tools/tools.component').then(m => m.ToolsComponent)
  },
  {
    path: 'experience',
    loadComponent: () => import('../../components/experience/experience.component').then(m => m.ExperienceComponent)
  },
  {
    path: 'blog',
    loadComponent: () => import('../../components/blogs/blogs.component').then(m => m.BlogsComponent)
  },
  {
    path: 'achievements',
    loadComponent: () => import('../../components/achievements/achievements.component').then(m => m.AchievementsComponent)
  },
  {
    path: 'project/:id',
    loadComponent: () => import('../../components/project-detail/project-detail.component').then(m => m.ProjectDetailComponent)
  }
];
