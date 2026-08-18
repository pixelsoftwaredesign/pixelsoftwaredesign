import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Company } from '../models/models';

@Injectable({ providedIn: 'root' })
export class CompanyService {
  private api = 'http://localhost:8080/api/companies';
  constructor(private http: HttpClient) {}
  getAll(): Observable<Company[]> { return this.http.get<Company[]>(this.api); }
  getById(id: number): Observable<Company> { return this.http.get<Company>(`${this.api}/${id}`); }
  create(c: Company): Observable<Company> { return this.http.post<Company>(this.api, c); }
  update(id: number, c: Company): Observable<Company> { return this.http.put<Company>(`${this.api}/${id}`, c); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.api}/${id}`); }
  search(name: string): Observable<Company[]> { return this.http.get<Company[]>(`${this.api}/search`, { params: { name } }); }
}
