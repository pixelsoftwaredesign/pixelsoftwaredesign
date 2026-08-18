import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Attendance } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AttendanceService {
  private url = 'http://localhost:8081/api/attendance';
  constructor(private http: HttpClient) {}
  getAll(): Observable<Attendance[]> { return this.http.get<Attendance[]>(this.url); }
  create(a: Attendance): Observable<Attendance> { return this.http.post<Attendance>(this.url, a); }
  update(id: number, a: Attendance): Observable<Attendance> { return this.http.put<Attendance>(`${this.url}/${id}`, a); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }
  getByEmployee(id: number): Observable<Attendance[]> { return this.http.get<Attendance[]>(`${this.url}/employee/${id}`); }
  getByDate(date: string): Observable<Attendance[]> { return this.http.get<Attendance[]>(`${this.url}/date/${date}`); }
}
