import { Component, signal, ElementRef, QueryList, ViewChildren, AfterViewInit, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
export class SkillsComponent implements AfterViewInit {
  private destroyRef = inject(DestroyRef);
  activeTab = signal<'core' | 'cybersecurity'>('core');

  @ViewChildren('skillBadge') skillBadges!: QueryList<ElementRef>;

  coreCategories: SkillCategory[] = [
    {
      icon: 'fas fa-laptop-code',
      title: 'Programming Languages',
      skills: [
        { icon: 'fab fa-python', name: 'Python', level: 90 },
        { icon: 'fab fa-java', name: 'Java', level: 85 },
        { icon: 'fas fa-copyright', name: 'C/C++', level: 80 },
        { icon: 'fas fa-database', name: 'SQL', level: 75 },
        { icon: 'fas fa-brain', name: 'Prolog', level: 70 },
        { icon: 'fas fa-calculator', name: 'MATLAB', level: 75 }
      ]
    },
    {
      icon: 'fas fa-globe',
      title: 'Web Development',
      skills: [
        { icon: 'fab fa-html5', name: 'HTML5', level: 90 },
        { icon: 'fab fa-css3-alt', name: 'CSS3', level: 88 },
        { icon: 'fab fa-js', name: 'JavaScript', level: 85 },
        { icon: 'fab fa-react', name: 'React', level: 80 },
        { icon: 'fab fa-node-js', name: 'Node.js', level: 78 },
        { icon: 'fab fa-bootstrap', name: 'Bootstrap', level: 75 },
        { icon: 'fab fa-angular', name: 'Angular', level: 75 }
      ]
    },
    {
      icon: 'fas fa-book',
      title: 'Core Concepts',
      skills: [
        { icon: 'fas fa-project-diagram', name: 'DSA', level: 88 },
        { icon: 'fas fa-cube', name: 'OOP', level: 85 },
        { icon: 'fas fa-robot', name: 'Machine Learning', level: 80 },
        { icon: 'fas fa-database', name: 'DBMS', level: 75 }
      ]
    },
    {
      icon: 'fas fa-users',
      title: 'Professional Skills',
      skills: [
        { icon: 'fas fa-lightbulb', name: 'Problem Solving', isSoft: true },
        { icon: 'fas fa-users-cog', name: 'Team Collaboration', isSoft: true },
        { icon: 'fas fa-comments', name: 'Communication', isSoft: true },
        { icon: 'fas fa-clock', name: 'Time Management', isSoft: true },
        { icon: 'fas fa-chart-line', name: 'Adaptability', isSoft: true },
        { icon: 'fas fa-trophy', name: 'Leadership', isSoft: true }
      ]
    }
  ];

  cyberCategories: SkillCategory[] = [
    {
      icon: 'fas fa-tools',
      title: 'Security Tools',
      skills: [
        { icon: 'fas fa-network-wired', name: 'Nmap', level: 90, isCyber: true },
        { icon: 'fas fa-chart-line', name: 'Wireshark', level: 88, isCyber: true },
        { icon: 'fas fa-search', name: 'Splunk', level: 85, isCyber: true },
        { icon: 'fas fa-shield-alt', name: 'Metasploit', level: 82, isCyber: true },
        { icon: 'fas fa-bug', name: 'Burp Suite', level: 80, isCyber: true },
        { icon: 'fas fa-lock', name: 'Nessus', level: 78, isCyber: true }
      ]
    },
    {
      icon: 'fas fa-shield-alt',
      title: 'Security Domains',
      skills: [
        { icon: 'fas fa-user-secret', name: 'Penetration Testing', level: 88, isCyber: true },
        { icon: 'fas fa-virus-slash', name: 'Malware Analysis', level: 82, isCyber: true },
        { icon: 'fas fa-fingerprint', name: 'Digital Forensics', level: 78, isCyber: true },
        { icon: 'fas fa-network-wired', name: 'Network Security', level: 85, isCyber: true },
        { icon: 'fas fa-cloud', name: 'Cloud Security', level: 75, isCyber: true },
        { icon: 'fas fa-server', name: 'System Hardening', level: 80, isCyber: true }
      ]
    },
    {
      icon: 'fas fa-certificate',
      title: 'Certifications',
      skills: [
        { icon: 'fas fa-award', name: 'CEH (In Progress)', isSoft: true, isCyber: true },
        { icon: 'fas fa-award', name: 'OSCP (In Progress)', isSoft: true, isCyber: true },
        { icon: 'fas fa-award', name: 'CompTIA Security+', isSoft: true, isCyber: true },
        { icon: 'fas fa-award', name: 'TryHackMe Top 5%', isSoft: true, isCyber: true }
      ]
    }
  ];

  get activeCategories(): SkillCategory[] {
    return this.activeTab() === 'core' ? this.coreCategories : this.cyberCategories;
  }

  setTab(tab: 'core' | 'cybersecurity'): void {
    this.activeTab.set(tab);
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
