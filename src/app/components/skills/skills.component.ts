import { Component, signal, ElementRef, QueryList, ViewChildren, AfterViewInit, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ModeService } from '../../core/services/mode.service';

export interface SkillBadge {
  icon: string;
  name: string;
  level?: number;
  isSoft?: boolean;
  isCyber?: boolean;
}

export interface SkillCategory {
  icon: string;
  title: string;
  skills: SkillBadge[];
}

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css']
})
export class SkillsComponent implements OnInit, AfterViewInit {
  private destroyRef = inject(DestroyRef);
  private modeService = inject(ModeService);
  private router = inject(Router);

  public isSdeMode = signal(true);

  @ViewChildren('skillBadge') skillBadges!: QueryList<ElementRef>;

  // Pure SDE & Software Engineering Skills
  sdeCategories: SkillCategory[] = [
    {
      icon: 'fas fa-laptop-code',
      title: 'Programming Languages',
      skills: [
        { icon: 'fab fa-js', name: 'TypeScript / JavaScript', level: 90 },
        { icon: 'fab fa-python', name: 'Python', level: 88 },
        { icon: 'fab fa-java', name: 'Java', level: 85 },
        { icon: 'fas fa-copyright', name: 'C / C++', level: 80 },
        { icon: 'fas fa-database', name: 'SQL', level: 82 }
      ]
    },
    {
      icon: 'fas fa-globe',
      title: 'Frontend & Web Architecture',
      skills: [
        { icon: 'fab fa-angular', name: 'Angular (v17+ Standalone)', level: 88 },
        { icon: 'fab fa-react', name: 'React.js', level: 82 },
        { icon: 'fab fa-html5', name: 'HTML5 & Semantic Web', level: 92 },
        { icon: 'fab fa-css3-alt', name: 'Modern CSS3 & SCSS', level: 88 },
        { icon: 'fas fa-mobile-alt', name: 'Responsive UI / UX', level: 90 }
      ]
    },
    {
      icon: 'fas fa-server',
      title: 'Backend, APIs & Databases',
      skills: [
        { icon: 'fab fa-node-js', name: 'Node.js & Express', level: 85 },
        { icon: 'fas fa-database', name: 'PostgreSQL & MySQL', level: 82 },
        { icon: 'fas fa-leaf', name: 'MongoDB / NoSQL', level: 80 },
        { icon: 'fas fa-network-wired', name: 'RESTful API Design', level: 88 },
        { icon: 'fas fa-fire', name: 'Firebase & Cloud Firestore', level: 85 }
      ]
    },
    {
      icon: 'fas fa-cubes',
      title: 'Core Computer Science & Architecture',
      skills: [
        { icon: 'fas fa-project-diagram', name: 'Data Structures & Algorithms', level: 86 },
        { icon: 'fas fa-cube', name: 'Object-Oriented Programming (OOP)', level: 88 },
        { icon: 'fas fa-sitemap', name: 'System Design Basics', level: 80 },
        { icon: 'fas fa-database', name: 'Database Management (DBMS)', level: 82 }
      ]
    },
    {
      icon: 'fas fa-cogs',
      title: 'DevOps & Tooling',
      skills: [
        { icon: 'fab fa-git-alt', name: 'Git & GitHub', level: 90 },
        { icon: 'fab fa-docker', name: 'Docker Containerization', level: 78 },
        { icon: 'fas fa-terminal', name: 'Linux / Bash Scripting', level: 82 },
        { icon: 'fas fa-cloud', name: 'Netlify & Cloud Deployments', level: 85 },
        { icon: 'fas fa-vial', name: 'Unit Testing (Jasmine / Karma)', level: 80 }
      ]
    },
    {
      icon: 'fas fa-users',
      title: 'Engineering Practices & Soft Skills',
      skills: [
        { icon: 'fas fa-lightbulb', name: 'Problem Solving', isSoft: true },
        { icon: 'fas fa-users-cog', name: 'Agile & Team Collaboration', isSoft: true },
        { icon: 'fas fa-comments', name: 'Technical Communication', isSoft: true },
        { icon: 'fas fa-clock', name: 'Time & Sprint Management', isSoft: true }
      ]
    }
  ];

  // Pure Cybersecurity Skills (for Cybersecurity path)
  cyberCategories: SkillCategory[] = [
    {
      icon: 'fas fa-tools',
      title: 'Security & Assessment Tools',
      skills: [
        { icon: 'fas fa-network-wired', name: 'Nmap Port Scanner', level: 90, isCyber: true },
        { icon: 'fas fa-chart-line', name: 'Wireshark Packet Analysis', level: 88, isCyber: true },
        { icon: 'fas fa-bug', name: 'Burp Suite (Web Pentest)', level: 82, isCyber: true },
        { icon: 'fas fa-shield-alt', name: 'Metasploit Framework', level: 80, isCyber: true },
        { icon: 'fas fa-search', name: 'Splunk & SIEM Log Analysis', level: 80, isCyber: true }
      ]
    },
    {
      icon: 'fas fa-shield-alt',
      title: 'Security Domains & Offensive Security',
      skills: [
        { icon: 'fas fa-user-secret', name: 'Web Penetration Testing', level: 88, isCyber: true },
        { icon: 'fas fa-virus-slash', name: 'Malware Analysis & Triage', level: 80, isCyber: true },
        { icon: 'fas fa-network-wired', name: 'Network Defense & Firewalls', level: 85, isCyber: true },
        { icon: 'fas fa-fingerprint', name: 'Digital Forensics', level: 78, isCyber: true },
        { icon: 'fas fa-server', name: 'Linux / Windows Hardening', level: 82, isCyber: true }
      ]
    }
  ];

  ngOnInit(): void {
    const url = this.router.url;
    if (url.includes('/security')) {
      this.isSdeMode.set(false);
    } else {
      this.isSdeMode.set(this.modeService.currentMode() !== 'security');
    }
  }

  get activeCategories(): SkillCategory[] {
    return this.isSdeMode() ? this.sdeCategories : this.cyberCategories;
  }

  ngAfterViewInit(): void {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).style.opacity = '1';
          (entry.target as HTMLElement).style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1 });

    this.skillBadges.changes.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.skillBadges.forEach(badge => {
        observer.observe(badge.nativeElement);
      });
    });
  }
}
