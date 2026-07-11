import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, Blog } from '../../services/data.service';
import { AdminService } from '../../services/admin.service';
import { AdminOnlyDirective } from '../../directives/admin-only.directive';

@Component({
  selector: 'app-blogs',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminOnlyDirective],
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.css']
})
export class BlogsComponent implements OnInit {
  showAddForm = false;
  newBlog: Omit<Blog, 'id'> = {
    title: '',
    content: '',
    imageUrl: '',
    date: new Date().toISOString().split('T')[0],
    author: 'Sumit Jaiswal'
  };

  blogs$ = this.dataService.blogs$;

  constructor(
    public dataService: DataService,
    public adminService: AdminService
  ) {}

  ngOnInit(): void {}

  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.newBlog.imageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  addBlog() {
    if (this.newBlog.title && this.newBlog.content) {
      this.dataService.addBlog(this.newBlog);
      this.resetForm();
      this.showAddForm = false;
    }
  }

  deleteBlog(id: string) {
    if (confirm('Delete this blog post?')) {
      this.dataService.deleteBlog(id);
    }
  }

  resetForm() {
    this.newBlog = {
      title: '',
      content: '',
      imageUrl: '',
      date: new Date().toISOString().split('T')[0],
      author: 'Sumit Jaiswal'
    };
  }
}
