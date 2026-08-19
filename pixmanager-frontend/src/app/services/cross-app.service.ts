import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CrossAppService {
  private headers = new HttpHeaders({ 'X-Internal-API-Key': environment.internalApiKey });

  constructor(private http: HttpClient) {}

  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.pixErpApi}/api/internal/products`, { headers: this.headers });
  }

  getSales(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.pixErpApi}/api/internal/sales`, { headers: this.headers });
  }

  getExpenses(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.pixErpApi}/api/internal/expenses`, { headers: this.headers });
  }

  getDepartments(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.pixErpApi}/api/internal/departments`, { headers: this.headers });
  }
}
