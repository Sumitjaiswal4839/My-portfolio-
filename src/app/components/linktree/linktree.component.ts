import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-linktree',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './linktree.component.html',
    styleUrls: ['./linktree.component.css']
})
export class LinktreeComponent {
    profilePic = 'assets/profile.jpg'; // or placeholder
    name = 'Sumit Jaiswal';
    title = '  Learning Cybersecurity | Penetration Tester | CTF Player';

    links = [
        { name: 'Hack The Box', icon: 'fas fa-cube', url: '#', color: '#9fef00' },
        { name: 'TryHackMe', icon: 'fas fa-laptop-code', url: '#', color: '#bf202f' },
        { name: 'VulnHub', icon: 'fas fa-server', url: '#', color: '#ff9800' },
        { name: 'Unstop', icon: 'fas fa-bullseye', url: 'https://unstop.com/u/Sumit7827', color: '#007bff' },
        { name: 'CTFTime Profile', icon: 'fas fa-flag', url: '#', color: '#e91e63' },
        { name: 'GitHub', icon: 'fab fa-github', url: 'https://github.com/Sumitjaiswal4839', color: '#fff' },
        { name: 'LinkedIn', icon: 'fab fa-linkedin', url: 'https://www.linkedin.com/in/sumit-jaiswal-9403a9299', color: '#0077b5' }
    ];
}
