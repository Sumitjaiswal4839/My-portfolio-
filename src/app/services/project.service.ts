import { Injectable } from '@angular/core';
import { DataService, Project } from './data.service';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, catchError, switchMap, shareReplay } from 'rxjs/operators';

export { Project };

/**
 * Project Service [SECURITY 3.10]
 * Curated GitHub repository integration (filtered by topic / allow-list)
 */
@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  projects$: Observable<Project[]>;
  private githubUsername = 'Sumitjaiswal4839'; // Username updated to active portfolio owner

  // Topics required for GitHub repos to be curated and surfaced in portfolio [SECURITY 3.10]
  private allowedTopics = ['portfolio', 'featured', 'cybersecurity', 'sde', 'project', 'showcase', 'security'];

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
          .filter(repo => {
            if (repo.fork) return false;
            const topics: string[] = (repo.topics || []).map((t: string) => t.toLowerCase());
            // Filter strictly by curated topics [SECURITY 3.10]
            const hasAllowedTopic = topics.some(t => this.allowedTopics.includes(t));
            return hasAllowedTopic;
          })
          .map(repo => {
            const description = repo.description || 'Curated project repository.';
            const name = repo.name;
            const topics: string[] = (repo.topics || []).map((t: string) => t.toLowerCase());
            
            const cyberKeywords = [
              'cyber', 'security', 'pentest', 'exploit', 'malware', 'ctf', 'cve', 
              'defence', 'defense', 'sniffer', 'decrypt', 'encrypt', 
              'keylogger', 'reverse', 'vuln', 'auth', 'firewall', 'ids', 'ips'
            ];

            const isCyber = cyberKeywords.some(keyword => {
              const lowerName = name.toLowerCase();
              const lowerDesc = (description || '').toLowerCase();
              return lowerName.includes(keyword) || 
                     lowerDesc.includes(keyword) || 
                     topics.some((t: string) => t.includes(keyword));
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
        console.warn('Could not fetch projects from GitHub API:', err);
        return of([]);
      })
    );
  }

  getProjects(type?: 'cyber' | 'normal'): Observable<Project[]> {
    if (type) {
      return this.projects$.pipe(
        map(projects => projects.filter(p => p.type === type))
      );
    }
    return this.projects$;
  }

  getProjectById(id: string): Observable<Project | undefined> {
    return this.projects$.pipe(
      map(projects => projects.find(p => p.id === id))
    );
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
