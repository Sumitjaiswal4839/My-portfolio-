import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Certification {
  name: string;
  issuer: string;
  year: string;
  icon: string;
  comingSoon?: boolean;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {
  activeFilter: 'bio' | 'education' | 'experience' | 'skills' = 'bio';

  careerObjective = "My passion for cybersecurity started back in 10th grade. Every time I watched a hacking movie, I felt an intense curiosity and itch to figure out how it all actually worked behind the scenes. That curiosity drove me to start digging for details—researching where to study cybersecurity, how to learn the concepts, what skills to build, and mapping out the exact steps needed to get into this field. Since then, I've been constantly learning and building my path in securing digital systems.";

  educationList = [
    { title: "B.Tech CSE (Specialization in Cyber Security)", subtitle: "SVSU, Palwal, Haryana (Expected Graduation: 2027) | CGPA: 7.5+", icon: "fas fa-user-shield" },
    { title: "12th Grade (Higher Secondary)", subtitle: "GSSS (Sikri) State Board of Haryana (Year: 2022) | Percentage: 65.4%", icon: "fas fa-school" },
    { title: "10th Grade (Secondary)", subtitle: "GSSS (Sikri) State Board of Haryana (Year: 2019) | Percentage: 77.8%", icon: "fas fa-graduation-cap" }
  ];

  otherExperiences = [
    { role: "Data Entry Operator (DEO)", company: "Instacart Private Limited", icon: "fas fa-keyboard" },
    { role: "Quality Controller (QC)", company: "Grocery Limited", icon: "fas fa-check-circle" },
    { role: "Putter", company: "Biba (Fashion & Apparel) Limited", icon: "fas fa-tshirt" },
    { role: "Part-time Delivery Partner", company: "Swiggy Instamart (During College)", icon: "fas fa-motorcycle" }
  ];

  softSkills = [
    "Communication",
    "Leadership",
    "Responsible for Assigned Tasks",
    "Team Collaboration",
    "Problem Solving",
    "Quick Learner"
  ];

  languages = [
    "English",
    "Hindi"
  ];

  interests = [
    "Active participant in app development communities and hackathons.",
    "Deep interest in AI, Machine learning and legal-tech innovations."
  ];

  // New structured skills
  technicalSkills = {
    cybersecurity: [
      "Penetration Testing",
      "Network Security",
      "Vulnerability Assessment",
      "Burp Suite",
      "Nmap",
      "Wireshark",
      "Metasploit"
    ],
    development: [
      "TypeScript",
      "Angular",
      "Node.js",
      "Python",
      "Java",
      "REST APIs",
      "Docker"
    ],
    databases: [
      "PostgreSQL",
      "MongoDB",
      "MySQL"
    ],
    tools: [
      "Git",
      "CI/CD",
      "Linux",
      "VS Code"
    ]
  };

  certifications: Certification[] = [
    { name: "Comming Soon", issuer: "Comming Soon", year: "Comming Soon", icon: "fas fa-hourglass", comingSoon: true }
  ];

  setFilter(filter: 'bio' | 'education' | 'experience' | 'skills') {
    this.activeFilter = filter;
  }
}
