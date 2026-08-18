import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const PIXERP_API = 'http://localhost:8081';
const API_KEY = 'pixelsoft-internal-api-key-2026';

@Injectable({ providedIn: 'root' })
export class CrossAppService {
  private headers = new HttpHeaders({ 'X-Internal-API-Key': API_KEY });

  constructor(private http: HttpClient) {}

  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${PIXERP_API}/api/internal/products`, { headers: this.headers });
  }

  getSales(): Observable<any[]> {
    return this.http.get<any[]>(`${PIXERP_API}/api/internal/sales`, { headers: this.headers });
  }

  getExpenses(): Observable<any[]> {
    return this.http.get<any[]>(`${PIXERP_API}/api/internal/expenses`, { headers: this.headers });
  }

  getDepartments(): Observable<any[]> {
    return this.http.get<any[]>(`${PIXERP_API}/api/internal/departments`, { headers: this.headers });
  }
}
