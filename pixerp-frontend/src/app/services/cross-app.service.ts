import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const PIXMANAGER_API = 'http://localhost:8080';
const API_KEY = 'pixelsoft-internal-api-key-2026';

@Injectable({ providedIn: 'root' })
export class CrossAppService {
  private headers = new HttpHeaders({ 'X-Internal-API-Key': API_KEY });

  constructor(private http: HttpClient) {}

  getContacts(): Observable<any[]> {
    return this.http.get<any[]>(`${PIXMANAGER_API}/api/internal/contacts`, { headers: this.headers });
  }

  getCompanies(): Observable<any[]> {
    return this.http.get<any[]>(`${PIXMANAGER_API}/api/internal/companies`, { headers: this.headers });
  }

  getDeals(): Observable<any[]> {
    return this.http.get<any[]>(`${PIXMANAGER_API}/api/internal/deals`, { headers: this.headers });
  }

  getInvoices(): Observable<any[]> {
    return this.http.get<any[]>(`${PIXMANAGER_API}/api/internal/invoices`, { headers: this.headers });
  }
}
