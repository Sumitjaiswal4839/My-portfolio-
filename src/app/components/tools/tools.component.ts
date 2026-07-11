import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, Tool } from '../../services/data.service';
import { AdminService } from '../../services/admin.service';
import { AdminOnlyDirective } from '../../directives/admin-only.directive';

@Component({
  selector: 'app-tools',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminOnlyDirective],
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.css']
})
export class ToolsComponent implements OnInit {
  showAddForm = false;
  newTool: Omit<Tool, 'id'> = {
    name: '',
    description: '',
    icon: 'fas fa-tools',
    previewLink: '',
    folderPath: '',
    isSelfMade: false
  };

  tools$ = this.dataService.tools$;

  constructor(
    public dataService: DataService,
    public adminService: AdminService
  ) {}

  ngOnInit(): void {}

  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
  }

  addTool() {
    if (this.newTool.name) {
      this.dataService.addTool(this.newTool);
      this.resetForm();
      this.showAddForm = false;
    }
  }

  deleteTool(id: string) {
    if (confirm('Delete this tool?')) {
      this.dataService.deleteTool(id);
    }
  }

  resetForm() {
    this.newTool = {
      name: '',
      description: '',
      icon: 'fas fa-tools',
      previewLink: '',
      folderPath: '',
      isSelfMade: false
    };
  }
}
