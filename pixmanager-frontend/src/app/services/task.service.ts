import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/models';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private api = 'http://localhost:8080/api/tasks';
  constructor(private http: HttpClient) {}
  getAll(): Observable<Task[]> { return this.http.get<Task[]>(this.api); }
  create(t: Task): Observable<Task> { return this.http.post<Task>(this.api, t); }
  updateStatus(id: number, status: string): Observable<Task> { return this.http.patch<Task>(`${this.api}/${id}/status`, null, { params: { status } }); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.api}/${id}`); }
}
