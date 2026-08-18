import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Deal } from '../models/models';

@Injectable({ providedIn: 'root' })
export class DealService {
  private api = 'http://localhost:8080/api/deals';
  constructor(private http: HttpClient) {}
  getAll(): Observable<Deal[]> { return this.http.get<Deal[]>(this.api); }
  getById(id: number): Observable<Deal> { return this.http.get<Deal>(`${this.api}/${id}`); }
  create(d: Deal): Observable<Deal> { return this.http.post<Deal>(this.api, d); }
  update(id: number, d: Deal): Observable<Deal> { return this.http.put<Deal>(`${this.api}/${id}`, d); }
  updateStage(id: number, stage: string): Observable<Deal> { return this.http.patch<Deal>(`${this.api}/${id}/stage`, null, { params: { stage } }); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.api}/${id}`); }
}
