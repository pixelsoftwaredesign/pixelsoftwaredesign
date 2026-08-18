import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/models';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private url = 'http://localhost:8081/api/categories';
  constructor(private http: HttpClient) {}
  getAll(): Observable<Category[]> { return this.http.get<Category[]>(this.url); }
  getById(id: number): Observable<Category> { return this.http.get<Category>(`${this.url}/${id}`); }
  create(c: Category): Observable<Category> { return this.http.post<Category>(this.url, c); }
  update(id: number, c: Category): Observable<Category> { return this.http.put<Category>(`${this.url}/${id}`, c); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }
}
