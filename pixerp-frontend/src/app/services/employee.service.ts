import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../models/models';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private url = 'http://localhost:8081/api/employees';
  constructor(private http: HttpClient) {}
  getAll(): Observable<Employee[]> { return this.http.get<Employee[]>(this.url); }
  getById(id: number): Observable<Employee> { return this.http.get<Employee>(`${this.url}/${id}`); }
  create(e: Employee): Observable<Employee> { return this.http.post<Employee>(this.url, e); }
  update(id: number, e: Employee): Observable<Employee> { return this.http.put<Employee>(`${this.url}/${id}`, e); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }
  getByDepartment(id: number): Observable<Employee[]> { return this.http.get<Employee[]>(`${this.url}/department/${id}`); }
}
