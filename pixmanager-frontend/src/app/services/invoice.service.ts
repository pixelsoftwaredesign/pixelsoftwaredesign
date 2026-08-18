import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Invoice } from '../models/models';

@Injectable({ providedIn: 'root' })
export class InvoiceService {
  private api = 'http://localhost:8080/api/invoices';
  constructor(private http: HttpClient) {}
  getAll(): Observable<Invoice[]> { return this.http.get<Invoice[]>(this.api); }
  getById(id: number): Observable<Invoice> { return this.http.get<Invoice>(`${this.api}/${id}`); }
  create(i: Invoice): Observable<Invoice> { return this.http.post<Invoice>(this.api, i); }
  update(id: number, i: Invoice): Observable<Invoice> { return this.http.put<Invoice>(`${this.api}/${id}`, i); }
  convert(quotationId: number): Observable<Invoice> { return this.http.post<Invoice>(`${this.api}/${quotationId}/convert`, null); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.api}/${id}`); }
}
