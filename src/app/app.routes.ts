import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./components/hero/hero.component').then(m => m.HeroComponent) },
  { path: 'home', loadComponent: () => import('./components/hero/hero.component').then(m => m.HeroComponent) },
  { path: 'about', loadComponent: () => import('./components/about/about.component').then(m => m.AboutComponent) },
  { path: 'experience', loadComponent: () => import('./components/experience/experience.component').then(m => m.ExperienceComponent) },
  { path: 'skills', loadComponent: () => import('./components/skills/skills.component').then(m => m.SkillsComponent) },
  { path: 'contact', loadComponent: () => import('./components/contact/contact.component').then(m => m.ContactComponent) },
  { path: 'links', loadComponent: () => import('./components/linktree/linktree.component').then(m => m.LinktreeComponent) },
  { path: 'projects', loadComponent: () => import('./components/projects/projects.component').then(m => m.ProjectsComponent) },
  { path: 'project/:id', loadComponent: () => import('./components/project-detail/project-detail.component').then(m => m.ProjectDetailComponent) },
  { path: 'certifications', loadComponent: () => import('./components/certifications/certifications.component').then(m => m.CertificationsComponent) },
  { path: 'blog', loadComponent: () => import('./components/blogs/blogs.component').then(m => m.BlogsComponent) },
  { path: 'achievements', loadComponent: () => import('./components/achievements/achievements.component').then(m => m.AchievementsComponent) },
  { path: 'tools', loadComponent: () => import('./components/tools/tools.component').then(m => m.ToolsComponent) },
  { path: '**', redirectTo: '' }
];
