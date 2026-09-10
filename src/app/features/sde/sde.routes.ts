import { Routes } from '@angular/router';

export const SDE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./hero/hero.component').then(m => m.SdeHeroComponent)
  },
  {
    path: 'projects',
    loadComponent: () => import('../../components/projects/projects.component').then(m => m.ProjectsComponent)
  },
  {
    path: 'skills',
    loadComponent: () => import('../../components/skills/skills.component').then(m => m.SkillsComponent)
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
