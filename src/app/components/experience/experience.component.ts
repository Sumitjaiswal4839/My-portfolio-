import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ModeService } from '../../core/services/mode.service';

export interface WorkExperience {
  role: string;
  company: string;
  duration: string;
  details: string;
  skills?: string[];
}

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.css']
})
export class ExperienceComponent implements OnInit {
  private modeService = inject(ModeService);
  private router = inject(Router);

  public isSdeMode = true;

  // Cybersecurity specific internships & roles
  cyberExperiences: WorkExperience[] = [
    {
      role: "Cybersecurity Intern",
      company: "Skillset Go EduTech",
      duration: "15 September 2026 - Present",
      details: "Selected for a remote internship focused on practical implementation, completing 3 Mini Projects and 2 Major Projects to gain hands-on experience and contribute to the organization's cybersecurity team.",
      skills: ['Practical Security Assessments', 'Project Implementation', 'Security Analysis']
    },
    {
      role: "Cyber Security Intern",
      company: "Redynox",
      duration: "6 August 2026 - 5 September 2026",
      details: "Successfully completed a one-month internship gaining hands-on experience in network security, vulnerability assessment, penetration testing, and incident response by working closely with professional teams on real-world projects.",
      skills: ['Network Security', 'Vulnerability Assessment', 'Penetration Testing', 'Incident Response']
    },
    {
      role: "Cybersecurity Intern",
      company: "UptoSkills",
      duration: "April 13, 2026 - July 13, 2026",
      details: "Selected as a Cybersecurity Intern, focusing on practical security assessments, vulnerability analysis, web pentesting, and contributing to the defense mechanisms of real-world environments.",
      skills: ['Vulnerability Assessment', 'Web Penetration Testing', 'Nmap', 'Burp Suite', 'Incident Triage']
    }
  ];

  // Software Development Engineering specific experiences
  sdeExperiences: WorkExperience[] = [
    {
      role: "Software Development Engineer (Projects & Systems)",
      company: "Independent & Open Source Development",
      duration: "2024 - Present",
      details: "Designing and engineering responsive full-stack applications with Angular, TypeScript, Node.js, Express, and modern databases. Creating scalable REST APIs, reactive state management, and optimized build architectures.",
      skills: ['Angular', 'TypeScript', 'Node.js', 'PostgreSQL', 'REST APIs', 'System Architecture']
    }
  ];

  ngOnInit(): void {
    const url = this.router.url;
    if (url.includes('/security')) {
      this.isSdeMode = false;
    } else {
      this.isSdeMode = this.modeService.currentMode() !== 'security';
    }
  }

  get experiences(): WorkExperience[] {
    return this.isSdeMode ? this.sdeExperiences : this.cyberExperiences;
  }
}
