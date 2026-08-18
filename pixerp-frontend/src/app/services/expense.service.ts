import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Expense } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ExpenseService {
  private url = 'http://localhost:8081/api/expenses';
  constructor(private http: HttpClient) {}
  getAll(): Observable<Expense[]> { return this.http.get<Expense[]>(this.url); }
  getById(id: number): Observable<Expense> { return this.http.get<Expense>(`${this.url}/${id}`); }
  create(e: Expense): Observable<Expense> { return this.http.post<Expense>(this.url, e); }
  update(id: number, e: Expense): Observable<Expense> { return this.http.put<Expense>(`${this.url}/${id}`, e); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }
  getByDateRange(start: string, end: string): Observable<Expense[]> {
    return this.http.get<Expense[]>(`${this.url}/date-range?start=${start}&end=${end}`);
  }
}
