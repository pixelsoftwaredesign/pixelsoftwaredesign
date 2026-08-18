import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Interaction } from '../models/models';

@Injectable({ providedIn: 'root' })
export class InteractionService {
  private api = 'http://localhost:8080/api/interactions';
  constructor(private http: HttpClient) {}
  getAll(): Observable<Interaction[]> { return this.http.get<Interaction[]>(this.api); }
  create(i: Interaction): Observable<Interaction> { return this.http.post<Interaction>(this.api, i); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.api}/${id}`); }
  getByCompany(id: number): Observable<Interaction[]> { return this.http.get<Interaction[]>(`${this.api}/company/${id}`); }
  getPendingFollowUps(): Observable<Interaction[]> { return this.http.get<Interaction[]>(`${this.api}/follow-ups`); }
}
