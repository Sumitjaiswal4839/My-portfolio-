import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-fixed-bottom-navbar',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './fixed-bottom-navbar.component.html',
    styleUrls: ['./fixed-bottom-navbar.component.css']
})
export class FixedBottomNavbarComponent {
    profileData = {
        bio: 'Cybersecurity Professional | Ethical Hacker | Penetration Tester',
        experience: '3+ Years | Network Security, Threat Analysis & Vulnerability Assessment',
        location: 'India',
        email: 'contact@sumitjaiswal.com',
        specialization: 'Cybersecurity & Ethical Hacking'
    };

    copyEmail(): void {
        navigator.clipboard.writeText(this.profileData.email);
        alert('Email copied!');
    }
}
