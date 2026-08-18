import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-page">
      <div class="login-card">
        <div class="login-header">
          <h1>PixERP</h1>
          <p>Enterprise Resource Planning</p>
        </div>
        <div class="tabs">
          <button [class.active]="mode === 'login'" (click)="mode = 'login'">Sign In</button>
          <button [class.active]="mode === 'register'" (click)="mode = 'register'">Sign Up</button>
        </div>
        <form *ngIf="mode === 'login'" (ngSubmit)="onLogin()">
          <div class="field"><label>Email</label><input type="email" [(ngModel)]="loginEmail" name="email" placeholder="admin@pixelsoftwaredesign.com" required></div>
          <div class="field"><label>Password</label><input type="password" [(ngModel)]="loginPassword" name="password" placeholder="Enter password" required></div>
          <div class="error" *ngIf="errorMessage">{{ errorMessage }}</div>
          <button type="submit" class="btn-primary" [disabled]="loading">{{ loading ? 'Signing in...' : 'Sign In' }}</button>
        </form>
        <form *ngIf="mode === 'register'" (ngSubmit)="onRegister()">
          <div class="field"><label>Username</label><input type="text" [(ngModel)]="regUsername" name="username" required></div>
          <div class="field"><label>Email</label><input type="email" [(ngModel)]="regEmail" name="email" required></div>
          <div class="field"><label>Password</label><input type="password" [(ngModel)]="regPassword" name="password" required></div>
          <div class="field"><label>Role</label>
            <select [(ngModel)]="regRole" name="role">
              <option value="STAFF">Staff</option><option value="CASHIER">Cashier</option>
              <option value="ACCOUNTANT">Accountant</option><option value="HR">HR</option>
              <option value="MANAGER">Manager</option><option value="ADMIN">Admin</option>
            </select>
          </div>
          <div class="error" *ngIf="errorMessage">{{ errorMessage }}</div>
          <button type="submit" class="btn-primary" [disabled]="loading">{{ loading ? 'Creating...' : 'Create Account' }}</button>
        </form>
        <div class="demo-info"><p><strong>Demo:</strong> admin&#64;pixelsoftwaredesign.com / admin123</p></div>
      </div>
    </div>
  `,
  styles: [`
    .login-page { display: flex; justify-content: center; align-items: center; min-height: 100vh; background: linear-gradient(135deg, #134e4a 0%, #0f766e 50%, #0d9488 100%); }
    .login-card { background: white; border-radius: 16px; padding: 40px; width: 420px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
    .login-header { text-align: center; margin-bottom: 30px; }
    .login-header h1 { margin: 0; font-size: 2rem; color: #134e4a; }
    .login-header p { margin: 5px 0 0; color: #6b7280; font-size: 0.9rem; }
    .tabs { display: flex; margin-bottom: 25px; border-bottom: 2px solid #e5e7eb; }
    .tabs button { flex: 1; padding: 12px; border: none; background: none; cursor: pointer; font-size: 0.95rem; color: #6b7280; border-bottom: 2px solid transparent; margin-bottom: -2px; }
    .tabs button.active { color: #0d9488; border-bottom-color: #0d9488; font-weight: 600; }
    .field { margin-bottom: 18px; }
    .field label { display: block; margin-bottom: 6px; font-size: 0.85rem; font-weight: 500; color: #374151; }
    .field input, .field select { width: 100%; padding: 10px 14px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 0.95rem; outline: none; }
    .field input:focus, .field select:focus { border-color: #0d9488; box-shadow: 0 0 0 3px rgba(13,148,136,0.1); }
    .error { color: #dc2626; font-size: 0.85rem; margin-bottom: 15px; padding: 10px; background: #fef2f2; border-radius: 6px; }
    .btn-primary { width: 100%; padding: 12px; background: #0d9488; color: white; border: none; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer; }
    .btn-primary:hover { background: #0f766e; }
    .btn-primary:disabled { background: #9ca3af; cursor: not-allowed; }
    .demo-info { margin-top: 25px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; }
    .demo-info p { margin: 4px 0; font-size: 0.8rem; color: #6b7280; }
  `]
})
export class LoginComponent {
  mode: 'login' | 'register' = 'login';
  loginEmail = ''; loginPassword = '';
  regUsername = ''; regEmail = ''; regPassword = ''; regRole = 'STAFF';
  errorMessage = ''; loading = false;

  constructor(private authService: AuthService, private router: Router) {
    if (this.authService.isLoggedIn()) this.router.navigate(['/dashboard']);
  }

  onLogin(): void {
    this.loading = true; this.errorMessage = '';
    this.authService.login(this.loginEmail, this.loginPassword).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => { this.errorMessage = err.error?.error || 'Invalid credentials'; this.loading = false; }
    });
  }

  onRegister(): void {
    this.loading = true; this.errorMessage = '';
    this.authService.register(this.regUsername, this.regEmail, this.regPassword, this.regRole).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => { this.errorMessage = err.error?.error || 'Registration failed'; this.loading = false; }
    });
  }
}
