import { Routes } from '@angular/router';
import { modeGuard } from './core/services/mode.guard';

export const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./features/landing/landing.component').then(m => m.LandingComponent),
    canActivate: [modeGuard]
  },
  {
    path: 'sde',
    loadChildren: () => import('./features/sde/sde.routes').then(m => m.SDE_ROUTES)
  },
  {
    path: 'security',
    loadChildren: () => import('./features/security/security.routes').then(m => m.SECURITY_ROUTES)
  },
  { 
    path: 'about', 
    loadComponent: () => import('./components/about/about.component').then(m => m.AboutComponent) 
  },
  { 
    path: 'contact', 
    loadComponent: () => import('./components/contact/contact.component').then(m => m.ContactComponent) 
  },
  { 
    path: 'links', 
    loadComponent: () => import('./components/linktree/linktree.component').then(m => m.LinktreeComponent) 
  },
  { 
    path: 'landing', 
    loadComponent: () => import('./features/landing/landing.component').then(m => m.LandingComponent)
  },
  { path: '**', redirectTo: '' }
];
