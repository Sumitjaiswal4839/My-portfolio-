import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-bottom-info',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './bottom-info.component.html',
    styleUrls: ['./bottom-info.component.css']
})
export class BottomInfoComponent implements OnInit {
    ngOnInit(): void {}
}
