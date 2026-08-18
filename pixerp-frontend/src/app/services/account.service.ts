import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Account } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private url = 'http://localhost:8081/api/accounts';
  constructor(private http: HttpClient) {}
  getAll(): Observable<Account[]> { return this.http.get<Account[]>(this.url); }
  getById(id: number): Observable<Account> { return this.http.get<Account>(`${this.url}/${id}`); }
  create(a: Account): Observable<Account> { return this.http.post<Account>(this.url, a); }
  update(id: number, a: Account): Observable<Account> { return this.http.put<Account>(`${this.url}/${id}`, a); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }
  getByType(type: string): Observable<Account[]> { return this.http.get<Account[]>(`${this.url}/type/${type}`); }
}
