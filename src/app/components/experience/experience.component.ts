import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.css']
})
export class ExperienceComponent {
  experiences = [
    {
      role: "Cybersecurity Intern",
      company: "UptoSkills",
      duration: "April 13, 2026 - July 13, 2026",
      details: "Selected as a Cybersecurity Intern, focusing on practical security assessments, vulnerability analysis, and contributing to the defense mechanisms of real-world environments."
    }
  ];
}
