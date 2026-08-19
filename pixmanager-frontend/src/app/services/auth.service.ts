import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

export interface AuthResponse {
  token: string;
  userId: number;
  username: string;
  email: string;
  role: string;
}

export interface UserInfo {
  id: number;
  username: string;
  email: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.pixManagerApi}/api/auth`;
  private currentUserSubject = new BehaviorSubject<UserInfo | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    const stored = localStorage.getItem('pixelsoft_user');
    if (stored) {
      this.currentUserSubject.next(JSON.parse(stored));
    }
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => {
        localStorage.setItem('pixelsoft_token', response.token);
        const user: UserInfo = { id: response.userId, username: response.username, email: response.email, role: response.role };
        localStorage.setItem('pixelsoft_user', JSON.stringify(user));
        this.currentUserSubject.next(user);
      })
    );
  }

  register(username: string, email: string, password: string, role?: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, { username, email, password, role }).pipe(
      tap(response => {
        localStorage.setItem('pixelsoft_token', response.token);
        const user: UserInfo = { id: response.userId, username: response.username, email: response.email, role: response.role };
        localStorage.setItem('pixelsoft_user', JSON.stringify(user));
        this.currentUserSubject.next(user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('pixelsoft_token');
    localStorage.removeItem('pixelsoft_user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null { return localStorage.getItem('pixelsoft_token'); }
  isLoggedIn(): boolean { return !!this.getToken(); }
  getCurrentUser(): UserInfo | null { return this.currentUserSubject.value; }
}
