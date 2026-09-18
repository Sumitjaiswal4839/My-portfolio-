import { Injectable } from '@angular/core';
import { DataService, Project } from './data.service';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  map,
  catchError,
  switchMap,
  shareReplay,
  expand,
  reduce
} from 'rxjs/operators';

export { Project };

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  projects$: Observable<Project[]>;

  private readonly githubUsername = 'Sumitjaiswal4839';
  private readonly perPage = 100;

  constructor(
    private dataService: DataService,
    private http: HttpClient
  ) {

    this.projects$ = this.dataService.projects$.pipe(

      switchMap(dbProjects =>
        this.getAllGitHubRepos().pipe(

          map(githubProjects => {

            const normalizeUrl = (url: string): string => {

              if (!url) {
                return '';
              }

              return url
                .trim()
                .toLowerCase()
                .replace(/\/+$/, '');
            };

            const dbGithubLinks = new Set(
              dbProjects
                .map(project =>
                  normalizeUrl(project.githubLink)
                )
                .filter(Boolean)
            );

            const uniqueGithubProjects =
              githubProjects.filter(project => {

                const githubUrl =
                  normalizeUrl(project.githubLink);

                return !dbGithubLinks.has(githubUrl);
              });

            return [
              ...dbProjects,
              ...uniqueGithubProjects
            ];
          })
        )
      ),

      shareReplay({
        bufferSize: 1,
        refCount: true
      })
    );
  }

  /**
   * Fetch ALL public repositories.
   *
   * Topics are NOT required.
   * Forked repositories are excluded.
   */
  private getAllGitHubRepos(): Observable<Project[]> {

    const fetchPage = (page: number): Observable<any[]> => {

      const url =
        `https://api.github.com/users/${this.githubUsername}/repos` +
        `?sort=updated` +
        `&direction=desc` +
        `&per_page=${this.perPage}` +
        `&page=${page}`;

      return this.http.get<any[]>(url);
    };

    return fetchPage(1).pipe(

      expand((repos, page) => {

        if (repos.length < this.perPage) {
          return of([]);
        }

        return fetchPage(page + 1);
      }),

      reduce(
        (allRepos: any[], repos: any[]) => {

          if (repos.length === 0) {
            return allRepos;
          }

          return [
            ...allRepos,
            ...repos
          ];
        },
        []
      ),

      map(repos => {

        return repos
          .filter(repo => !repo.fork)
          .map(repo => {

            const name =
              String(repo.name || '');

            const description =
              String(
                repo.description ||
                'GitHub repository by Sumit Jaiswal.'
              );

            const topics: string[] =
              Array.isArray(repo.topics)
                ? repo.topics.map(
                    (topic: string) =>
                      topic.toLowerCase()
                  )
                : [];

            /**
             * Automatic cybersecurity classification.
             */
            const cyberKeywords = [
              'cyber',
              'cybersecurity',
              'security',
              'pentest',
              'penetration',
              'exploit',
              'exploitation',
              'malware',
              'ctf',
              'capture-the-flag',
              'cve',
              'vulnerability',
              'vulnerabilities',
              'defence',
              'defense',
              'sniffer',
              'wireshark',
              'nmap',
              'burp',
              'metasploit',
              'forensics',
              'firewall',
              'ids',
              'ips',
              'soc',
              'siem',
              'threat',
              'infosec',
              'ethical-hacking',
              'cryptography'
            ];

            const searchableText = [
              name,
              description,
              ...topics
            ]
              .join(' ')
              .toLowerCase();

            const isCyber =
              cyberKeywords.some(
                keyword =>
                  searchableText.includes(keyword)
              );

            return {
              id: `github-${repo.id}`,

              title: name
                .replace(/[-_]/g, ' ')
                .replace(/\b\w/g, char =>
                  char.toUpperCase()
                ),

              type: isCyber
                ? 'cyber'
                : 'normal',

              liveLink:
                repo.homepage || '',

              githubLink:
                repo.html_url,

              description,

              isGitHubRepo: true

            } as Project;
          });
      }),

      catchError(error => {

        console.error(
          'Could not fetch GitHub repositories:',
          error
        );

        return of([]);
      })
    );
  }

  getProjects(
    type?: 'cyber' | 'normal'
  ): Observable<Project[]> {

    if (type) {

      return this.projects$.pipe(
        map(projects =>
          projects.filter(
            project =>
              project.type === type
          )
        )
      );
    }

    return this.projects$;
  }

  getProjectById(
    id: string
  ): Observable<Project | undefined> {

    return this.projects$.pipe(
      map(projects =>
        projects.find(
          project =>
            project.id === id
        )
      )
    );
  }

  addProject(
    project: Omit<Project, 'id'>
  ) {
    return this.dataService.addProject(project);
  }

  updateProject(
    id: string,
    project: Partial<Project>
  ) {
    return this.dataService.updateProject(
      id,
      project
    );
  }

  deleteProject(id: string) {
    return this.dataService.deleteProject(id);
  }
}
