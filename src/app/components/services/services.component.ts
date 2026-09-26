import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Service {
  icon: string;
  title: string;
  description: string;
  features: string[];
  mode: 'both' | 'sde' | 'security';
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})
export class ServicesComponent {
  services: Service[] = [
    {
      icon: 'fas fa-shield-alt',
      title: 'Security Audits',
      description: 'Comprehensive security assessments for web applications, networks, and infrastructure to identify vulnerabilities before attackers do.',
      features: [
        'Web Application Penetration Testing',
        'Network Security Assessment',
        'Vulnerability Scanning',
        'Security Report & Remediation'
      ],
      mode: 'security'
    },
    {
      icon: 'fas fa-code',
      title: 'Custom Development',
      description: 'Full-stack web application development with modern technologies, clean architecture, and scalable solutions.',
      features: [
        'Frontend Development (Angular, React)',
        'Backend Development (Node.js, Python)',
        'API Design & Integration',
        'Database Design & Optimization'
      ],
      mode: 'sde'
    },
    {
      icon: 'fas fa-chalkboard-teacher',
      title: 'Training & Mentorship',
      description: 'Personalized training sessions in cybersecurity, software development, and career guidance for aspiring professionals.',
      features: [
        'Cybersecurity Fundamentals',
        'Web Development Bootcamps',
        'Career Path Guidance',
        'Technical Interview Prep'
      ],
      mode: 'both'
    },
    {
      icon: 'fas fa-search',
      title: 'Code Review',
      description: 'Professional code reviews to ensure security best practices, performance optimization, and maintainability.',
      features: [
        'Security Code Review',
        'Performance Optimization',
        'Best Practices Implementation',
        'Documentation & Standards'
      ],
      mode: 'both'
    },
    {
      icon: 'fas fa-server',
      title: 'DevOps & Infrastructure',
      description: 'Setup and management of CI/CD pipelines, containerization, and cloud infrastructure for seamless deployment.',
      features: [
        'Docker & Kubernetes',
        'CI/CD Pipeline Setup',
        'Cloud Deployment (AWS/GCP)',
        'Infrastructure as Code'
      ],
      mode: 'sde'
    },
    {
      icon: 'fas fa-bug',
      title: 'Bug Bounty Support',
      description: 'Assistance with bug bounty programs, vulnerability disclosure, and responsible disclosure practices.',
      features: [
        'Bug Bounty Strategy',
        'Vulnerability Analysis',
        'Responsible Disclosure',
        'Report Writing'
      ],
      mode: 'security'
    }
  ];

  filteredServices(mode: string): Service[] {
    if (mode === 'sde') {
      return this.services.filter(s => s.mode === 'sde' || s.mode === 'both');
    } else if (mode === 'security') {
      return this.services.filter(s => s.mode === 'security' || s.mode === 'both');
    }
    return this.services;
  }

  currentMode: 'sde' | 'security' = 'sde';

  ngOnInit() {
    // Detect current mode from URL or service
    const url = window.location.pathname;
    if (url.includes('/security')) {
      this.currentMode = 'security';
    }
  }
}