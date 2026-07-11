import { Injectable } from '@angular/core';
import { DataService, Project } from './data.service';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, catchError, switchMap, shareReplay } from 'rxjs/operators';

export { Project };

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  projects$: Observable<Project[]>;
  private githubUsername = 'sj026';

  constructor(private dataService: DataService, private http: HttpClient) {
    this.projects$ = this.dataService.projects$.pipe(
      switchMap(dbProjects => {
        return this.fetchGitHubRepos().pipe(
          map(gitHubProjects => {
            const getNormalizedUrl = (url: string) => {
              if (!url) return '';
              return url.trim().toLowerCase().replace(/\/$/, '');
            };

            const dbGithubLinks = new Set(
              dbProjects
                .map(p => getNormalizedUrl(p.githubLink))
                .filter(link => link !== '')
            );

            const uniqueGitHubProjects = gitHubProjects.filter(gp => {
              const normLink = getNormalizedUrl(gp.githubLink);
              return normLink === '' || !dbGithubLinks.has(normLink);
            });

            return [...dbProjects, ...uniqueGitHubProjects];
          })
        );
      }),
      shareReplay(1)
    );
  }

  private fetchGitHubRepos(): Observable<Project[]> {
    const url = `https://api.github.com/users/${this.githubUsername}/repos?sort=updated&per_page=100`;
    return this.http.get<any[]>(url).pipe(
      map(repos => {
        return repos
          .filter(repo => !repo.fork)
          .map(repo => {
            const description = repo.description || 'No description provided.';
            const name = repo.name;
            const topics = repo.topics || [];
            
            const cyberKeywords = [
              'cyber', 'security', 'pentest', 'exploit', 'malware', 'ctf', 'cve', 
              'hacker', 'defence', 'defense', 'sniffer', 'decrypt', 'encrypt', 
              'keylogger', 'reverse', 'vuln', 'auth', 'firewall', 'ids', 'ips', 
              'mitm', 'spoofer', 'recon', 'nmap', 'wireshark', 'hash', 'crypt'
            ];

            const isCyber = cyberKeywords.some(keyword => {
              const lowerName = name.toLowerCase();
              const lowerDesc = description.toLowerCase();
              return lowerName.includes(keyword) || 
                     lowerDesc.includes(keyword) || 
                     topics.some((t: string) => t.toLowerCase().includes(keyword));
            });

            return {
              id: `github-${repo.id}`,
              title: repo.name.replace(/[-_]/g, ' '),
              type: (isCyber ? 'cyber' : 'normal') as 'cyber' | 'normal',
              liveLink: repo.homepage || '',
              githubLink: repo.html_url,
              description: description,
              isGitHubRepo: true
            };
          });
      }),
      catchError(err => {
        console.error('Failed to fetch projects from GitHub API', err);
        return of([]);
      })
    );
  }

  getProjects(type?: 'cyber' | 'normal'): Project[] {
    let projects: Project[] = [];
    this.projects$.subscribe(p => {
      projects = p;
    }).unsubscribe();
    
    if (type) {
      return projects.filter(p => p.type === type);
    }
    return projects;
  }

  addProject(project: Omit<Project, 'id'>) {
    this.dataService.addProject(project);
  }

  updateProject(id: string, project: Partial<Project>) {
    this.dataService.updateProject(id, project);
  }

  deleteProject(id: string) {
    this.dataService.deleteProject(id);
  }
}
