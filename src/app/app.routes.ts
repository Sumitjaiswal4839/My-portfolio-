import { Routes } from '@angular/router';
import { HeroComponent } from './components/hero/hero.component';
import { SkillsComponent } from './components/skills/skills.component';
import { ContactComponent } from './components/contact/contact.component';
import { LinktreeComponent } from './components/linktree/linktree.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { CertificationsComponent } from './components/certifications/certifications.component';
import { BlogsComponent } from './components/blogs/blogs.component';
import { AchievementsComponent } from './components/achievements/achievements.component';
import { ToolsComponent } from './components/tools/tools.component';
import { AboutComponent } from './components/about/about.component';
import { ExperienceComponent } from './components/experience/experience.component';

export const routes: Routes = [
  { path: '', component: HeroComponent },
  { path: 'home', component: HeroComponent },
  { path: 'about', component: AboutComponent },
  { path: 'experience', component: ExperienceComponent },
  { path: 'skills', component: SkillsComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'links', component: LinktreeComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: 'certifications', component: CertificationsComponent },
  { path: 'blog', component: BlogsComponent },
  { path: 'achievements', component: AchievementsComponent },
  { path: 'tools', component: ToolsComponent },
  { path: '**', redirectTo: '' }
];
