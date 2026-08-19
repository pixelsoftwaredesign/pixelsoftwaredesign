import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CrossAppService {
  private headers = new HttpHeaders({ 'X-Internal-API-Key': environment.internalApiKey });

  constructor(private http: HttpClient) {}

  getContacts(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.pixManagerApi}/api/internal/contacts`, { headers: this.headers });
  }

  getCompanies(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.pixManagerApi}/api/internal/companies`, { headers: this.headers });
  }

  getDeals(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.pixManagerApi}/api/internal/deals`, { headers: this.headers });
  }

  getInvoices(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.pixManagerApi}/api/internal/invoices`, { headers: this.headers });
  }
}
