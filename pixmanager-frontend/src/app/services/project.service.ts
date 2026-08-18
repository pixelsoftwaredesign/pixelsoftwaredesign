import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project, Task } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private api = 'http://localhost:8080/api/projects';
  constructor(private http: HttpClient) {}
  getAll(): Observable<Project[]> { return this.http.get<Project[]>(this.api); }
  getById(id: number): Observable<Project> { return this.http.get<Project>(`${this.api}/${id}`); }
  create(p: Project): Observable<Project> { return this.http.post<Project>(this.api, p); }
  update(id: number, p: Project): Observable<Project> { return this.http.put<Project>(`${this.api}/${id}`, p); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.api}/${id}`); }
  getTasks(id: number): Observable<Task[]> { return this.http.get<Task[]>(`${this.api}/${id}/tasks`); }
}
