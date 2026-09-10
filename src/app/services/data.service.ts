import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { 
  Firestore, collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc, setDoc 
} from "firebase/firestore";
import { FirebaseAppService } from '../core/services/firebase-app.service';

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
  category?: 'security' | 'sde' | 'general';
  imageUrl?: string;
  date: string;
  author: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category?: 'security' | 'sde' | 'general';
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
  private db: Firestore;

  private certsSubject = new BehaviorSubject<Certification[]>([]);
  private blogsSubject = new BehaviorSubject<Blog[]>([]);
  private achsSubject = new BehaviorSubject<Achievement[]>([]);
  private toolsSubject = new BehaviorSubject<Tool[]>([]);
  private projectsSubject = new BehaviorSubject<Project[]>([]);
  private resumeSubject = new BehaviorSubject<string | null>(null);

  private _loadError = new BehaviorSubject<string | null>(null);
  public loadError$ = this._loadError.asObservable();

  certs$ = this.certsSubject.asObservable();
  blogs$ = this.blogsSubject.asObservable();
  achs$ = this.achsSubject.asObservable();
  tools$ = this.toolsSubject.asObservable();
  projects$ = this.projectsSubject.asObservable();
  resume$ = this.resumeSubject.asObservable();

  constructor(private firebaseAppService: FirebaseAppService) {
    this.db = this.firebaseAppService.db;
    this.initRealtimeListeners();
  }

  private initRealtimeListeners() {
    try {
      onSnapshot(collection(this.db, "certifications"), 
        (snap) => {
          this.certsSubject.next(snap.docs.map(d => ({ id: d.id, ...d.data() } as Certification)));
        },
        (error) => {
          console.warn("Firestore certifications load error:", error);
          this._loadError.next('Unable to load certifications from database.');
        }
      );

      onSnapshot(collection(this.db, "blogs"), 
        (snap) => {
          this.blogsSubject.next(snap.docs.map(d => ({ id: d.id, ...d.data() } as Blog)));
        },
        (error) => {
          console.warn("Firestore blogs load error:", error);
          this._loadError.next('Unable to load blogs from database.');
        }
      );

      onSnapshot(collection(this.db, "achievements"), 
        (snap) => {
          this.achsSubject.next(snap.docs.map(d => ({ id: d.id, ...d.data() } as Achievement)));
        },
        (error) => {
          console.warn("Firestore achievements load error:", error);
          this._loadError.next('Unable to load achievements from database.');
        }
      );

      onSnapshot(collection(this.db, "tools"), 
        (snap) => {
          this.toolsSubject.next(snap.docs.map(d => ({ id: d.id, ...d.data() } as Tool)));
        },
        (error) => {
          console.warn("Firestore tools load error:", error);
          this._loadError.next('Unable to load tools from database.');
        }
      );

      onSnapshot(collection(this.db, "projects"), 
        (snap) => {
          this.projectsSubject.next(snap.docs.map(d => ({ id: d.id, ...d.data() } as Project)));
        },
        (error) => {
          console.warn("Firestore projects load error:", error);
          this._loadError.next('Unable to load projects from database.');
        }
      );
      
      // Listen for Resume under settings/resume [SECURITY 3.3]
      onSnapshot(doc(this.db, "settings", "resume"), 
        (d) => {
          if (d.exists()) {
            this.resumeSubject.next(d.data()['fileUrl'] || null);
          } else {
            this.resumeSubject.next(null);
          }
        },
        (error) => {
          console.warn("Firestore resume settings load error:", error);
        }
      );
    } catch (error) {
      console.error('Failed to initialize Firestore listeners:', error);
      this._loadError.next('Unable to connect to database. Some content might not display.');
    }
  }

  // Certifications
  async addCert(cert: Omit<Certification, 'id'>) {
    if (!this.db) return;
    await addDoc(collection(this.db, "certifications"), cert);
  }

  async deleteCert(id: string) {
    if (!this.db) return;
    await deleteDoc(doc(this.db, "certifications", id));
  }

  async updateCert(id: string, cert: Partial<Certification>) {
    if (!this.db) return;
    await updateDoc(doc(this.db, "certifications", id), cert as any);
  }

  // Blogs
  async addBlog(blog: Omit<Blog, 'id'>) {
    if (!this.db) return;
    await addDoc(collection(this.db, "blogs"), blog);
  }

  async deleteBlog(id: string) {
    if (!this.db) return;
    await deleteDoc(doc(this.db, "blogs", id));
  }

  async updateBlog(id: string, blog: Partial<Blog>) {
    if (!this.db) return;
    await updateDoc(doc(this.db, "blogs", id), blog as any);
  }

  // Achievements
  async addAchievement(ach: Omit<Achievement, 'id'>) {
    if (!this.db) return;
    await addDoc(collection(this.db, "achievements"), ach);
  }

  async deleteAchievement(id: string) {
    if (!this.db) return;
    await deleteDoc(doc(this.db, "achievements", id));
  }

  async updateAchievement(id: string, ach: Partial<Achievement>) {
    if (!this.db) return;
    await updateDoc(doc(this.db, "achievements", id), ach as any);
  }

  // Tools
  async addTool(tool: Omit<Tool, 'id'>) {
    if (!this.db) return;
    await addDoc(collection(this.db, "tools"), tool);
  }

  async deleteTool(id: string) {
    if (!this.db) return;
    await deleteDoc(doc(this.db, "tools", id));
  }

  async updateTool(id: string, tool: Partial<Tool>) {
    if (!this.db) return;
    await updateDoc(doc(this.db, "tools", id), tool as any);
  }

  // Projects
  async addProject(project: Omit<Project, 'id'>) {
    if (!this.db) return;
    await addDoc(collection(this.db, "projects"), project);
  }

  async deleteProject(id: string) {
    if (!this.db) return;
    await deleteDoc(doc(this.db, "projects", id));
  }

  async updateProject(id: string, project: Partial<Project>) {
    if (!this.db) return;
    await updateDoc(doc(this.db, "projects", id), project as any);
  }

  // Resume (Document path settings/resume matched with firestore.rules)
  async updateResume(fileUrl: string | null) {
    if (!this.db) return;
    if (fileUrl) {
      await setDoc(doc(this.db, "settings", "resume"), { fileUrl });
    } else {
      await deleteDoc(doc(this.db, "settings", "resume"));
    }
  }
}
