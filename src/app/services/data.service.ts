import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { 
  getFirestore, collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc, setDoc 
} from "firebase/firestore";
import { environment } from '../../environments/environment';

export interface Certification {
  id: string;
  title: string;
  description: string;
  fileUrl: string; // PDF, Image data URL
  fileType: string; // pdf, image, etc.
  date: string;
}

export interface Blog {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  date: string;
  author: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  date: string;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon?: string;
  previewLink?: string;
  folderPath?: string;
  isSelfMade: boolean;
}

export interface Project {
  id: string;
  title: string;
  type: 'cyber' | 'normal';
  liveLink: string;
  githubLink: string;
  description: string;
  isGitHubRepo?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private app: any;
  private db: any;

  private certsSubject = new BehaviorSubject<Certification[]>([]);
  private blogsSubject = new BehaviorSubject<Blog[]>([]);
  private achsSubject = new BehaviorSubject<Achievement[]>([]);
  private toolsSubject = new BehaviorSubject<Tool[]>([]);
  private projectsSubject = new BehaviorSubject<Project[]>([]);
  private resumeSubject = new BehaviorSubject<string | null>(null);

  certs$ = this.certsSubject.asObservable();
  blogs$ = this.blogsSubject.asObservable();
  achs$ = this.achsSubject.asObservable();
  tools$ = this.toolsSubject.asObservable();
  projects$ = this.projectsSubject.asObservable();
  resume$ = this.resumeSubject.asObservable();

  constructor() {
    try {
      this.app = initializeApp(environment.firebase);
      this.db = getFirestore(this.app);
      
      // Initialize Analytics
      isSupported().then(yes => {
        if(yes) getAnalytics(this.app);
      });

      this.initRealtimeListeners();
    } catch (error) {
      console.warn("Firebase not configured properly. Make sure you pasted your keys in src/environments/environment.ts!", error);
      // Fallback for demo before Firebase is configured
      this.resumeSubject.next(localStorage.getItem('user_resume'));
    }
  }

  private initRealtimeListeners() {
    onSnapshot(collection(this.db, "certifications"), (snap) => {
      this.certsSubject.next(snap.docs.map(d => ({ id: d.id, ...d.data() } as Certification)));
    });
    onSnapshot(collection(this.db, "blogs"), (snap) => {
      this.blogsSubject.next(snap.docs.map(d => ({ id: d.id, ...d.data() } as Blog)));
    });
    onSnapshot(collection(this.db, "achievements"), (snap) => {
      this.achsSubject.next(snap.docs.map(d => ({ id: d.id, ...d.data() } as Achievement)));
    });
    onSnapshot(collection(this.db, "tools"), (snap) => {
      this.toolsSubject.next(snap.docs.map(d => ({ id: d.id, ...d.data() } as Tool)));
    });
    onSnapshot(collection(this.db, "projects"), (snap) => {
      this.projectsSubject.next(snap.docs.map(d => ({ id: d.id, ...d.data() } as Project)));
    });
    
    // Listen for Resume
    onSnapshot(doc(this.db, "settings", "resume"), (d) => {
      if (d.exists()) {
        this.resumeSubject.next(d.data()['fileUrl'] || null);
      } else {
        this.resumeSubject.next(null);
      }
    });
  }

  // Certifications
  async addCert(cert: Omit<Certification, 'id'>) {
    if(!this.db) return;
    await addDoc(collection(this.db, "certifications"), cert);
  }

  async deleteCert(id: string) {
    if(!this.db) return;
    await deleteDoc(doc(this.db, "certifications", id));
  }

  async updateCert(id: string, cert: Partial<Certification>) {
    if(!this.db) return;
    await updateDoc(doc(this.db, "certifications", id), cert as any);
  }

  // Blogs
  async addBlog(blog: Omit<Blog, 'id'>) {
    if(!this.db) return;
    await addDoc(collection(this.db, "blogs"), blog);
  }

  async deleteBlog(id: string) {
    if(!this.db) return;
    await deleteDoc(doc(this.db, "blogs", id));
  }

  async updateBlog(id: string, blog: Partial<Blog>) {
    if(!this.db) return;
    await updateDoc(doc(this.db, "blogs", id), blog as any);
  }

  // Achievements
  async addAchievement(ach: Omit<Achievement, 'id'>) {
    if(!this.db) return;
    await addDoc(collection(this.db, "achievements"), ach);
  }

  async deleteAchievement(id: string) {
    if(!this.db) return;
    await deleteDoc(doc(this.db, "achievements", id));
  }

  async updateAchievement(id: string, ach: Partial<Achievement>) {
    if(!this.db) return;
    await updateDoc(doc(this.db, "achievements", id), ach as any);
  }

  // Tools
  async addTool(tool: Omit<Tool, 'id'>) {
    if(!this.db) return;
    await addDoc(collection(this.db, "tools"), tool);
  }

  async deleteTool(id: string) {
    if(!this.db) return;
    await deleteDoc(doc(this.db, "tools", id));
  }

  async updateTool(id: string, tool: Partial<Tool>) {
    if(!this.db) return;
    await updateDoc(doc(this.db, "tools", id), tool as any);
  }

  // Projects
  async addProject(project: Omit<Project, 'id'>) {
    if(!this.db) return;
    await addDoc(collection(this.db, "projects"), project);
  }

  async deleteProject(id: string) {
    if(!this.db) return;
    await deleteDoc(doc(this.db, "projects", id));
  }

  async updateProject(id: string, project: Partial<Project>) {
    if(!this.db) return;
    await updateDoc(doc(this.db, "projects", id), project as any);
  }

  // Resume
  async updateResume(fileUrl: string | null) {
    if(!this.db) {
       // local fallback temporarily
       if(fileUrl) localStorage.setItem('user_resume', fileUrl);
       else localStorage.removeItem('user_resume');
       this.resumeSubject.next(fileUrl);
       return;
    }
    if (fileUrl) {
      await setDoc(doc(this.db, "settings", "resume"), { fileUrl });
    } else {
      await deleteDoc(doc(this.db, "settings", "resume"));
    }
  }
}
