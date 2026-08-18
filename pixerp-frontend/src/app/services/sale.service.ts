import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sale } from '../models/models';

@Injectable({ providedIn: 'root' })
export class SaleService {
  private url = 'http://localhost:8081/api/sales';
  constructor(private http: HttpClient) {}
  getAll(): Observable<Sale[]> { return this.http.get<Sale[]>(this.url); }
  getById(id: number): Observable<Sale> { return this.http.get<Sale>(`${this.url}/${id}`); }
  create(sale: any): Observable<Sale> { return this.http.post<Sale>(`${this.url}/create`, sale); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }
}
