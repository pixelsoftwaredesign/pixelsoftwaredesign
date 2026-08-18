import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Payment } from '../models/models';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private api = 'http://localhost:8080/api/payments';
  constructor(private http: HttpClient) {}
  getAll(): Observable<Payment[]> { return this.http.get<Payment[]>(this.api); }
  create(p: Payment): Observable<Payment> { return this.http.post<Payment>(this.api, p); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.api}/${id}`); }
  getByInvoice(id: number): Observable<Payment[]> { return this.http.get<Payment[]>(`${this.api}/invoice/${id}`); }
}
