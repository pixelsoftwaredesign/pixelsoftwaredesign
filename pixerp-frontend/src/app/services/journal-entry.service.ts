import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JournalEntry } from '../models/models';

@Injectable({ providedIn: 'root' })
export class JournalEntryService {
  private url = 'http://localhost:8081/api/journal-entries';
  constructor(private http: HttpClient) {}
  getAll(): Observable<JournalEntry[]> { return this.http.get<JournalEntry[]>(this.url); }
  getById(id: number): Observable<JournalEntry> { return this.http.get<JournalEntry>(`${this.url}/${id}`); }
  create(j: JournalEntry): Observable<JournalEntry> { return this.http.post<JournalEntry>(this.url, j); }
  update(id: number, j: JournalEntry): Observable<JournalEntry> { return this.http.put<JournalEntry>(`${this.url}/${id}`, j); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }
  getByDateRange(start: string, end: string): Observable<JournalEntry[]> {
    return this.http.get<JournalEntry[]>(`${this.url}/date-range?start=${start}&end=${end}`);
  }
}
