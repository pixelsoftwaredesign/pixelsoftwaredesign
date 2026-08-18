import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InvoiceItem } from '../models/models';

@Injectable({ providedIn: 'root' })
export class InvoiceItemService {
  private api = 'http://localhost:8080/api/invoice-items';
  constructor(private http: HttpClient) {}
  getByInvoice(id: number): Observable<InvoiceItem[]> { return this.http.get<InvoiceItem[]>(`${this.api}/invoice/${id}`); }
  create(i: InvoiceItem): Observable<InvoiceItem> { return this.http.post<InvoiceItem>(this.api, i); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.api}/${id}`); }
}
