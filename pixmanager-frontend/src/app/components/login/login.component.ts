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
          <h1>PixManager</h1>
          <p>CRM & Business Management</p>
        </div>

        <div class="tabs">
          <button [class.active]="mode === 'login'" (click)="mode = 'login'">Sign In</button>
          <button [class.active]="mode === 'register'" (click)="mode = 'register'">Sign Up</button>
        </div>

        <form *ngIf="mode === 'login'" (ngSubmit)="onLogin()">
          <div class="field">
            <label>Email</label>
            <input type="email" [(ngModel)]="loginEmail" name="email" placeholder="admin@pixelsoftwaredesign.com" required>
          </div>
          <div class="field">
            <label>Password</label>
            <input type="password" [(ngModel)]="loginPassword" name="password" placeholder="Enter password" required>
          </div>
          <div class="error" *ngIf="errorMessage">{{ errorMessage }}</div>
          <button type="submit" class="btn-primary" [disabled]="loading">
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <form *ngIf="mode === 'register'" (ngSubmit)="onRegister()">
          <div class="field">
            <label>Username</label>
            <input type="text" [(ngModel)]="regUsername" name="username" placeholder="Your name" required>
          </div>
          <div class="field">
            <label>Email</label>
            <input type="email" [(ngModel)]="regEmail" name="email" placeholder="you@company.com" required>
          </div>
          <div class="field">
            <label>Password</label>
            <input type="password" [(ngModel)]="regPassword" name="password" placeholder="Min 6 characters" required>
          </div>
          <div class="field">
            <label>Role</label>
            <select [(ngModel)]="regRole" name="role">
              <option value="SALES">Sales</option>
              <option value="MANAGER">Manager</option>
              <option value="DEVELOPER">Developer</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <div class="error" *ngIf="errorMessage">{{ errorMessage }}</div>
          <button type="submit" class="btn-primary" [disabled]="loading">
            {{ loading ? 'Creating account...' : 'Create Account' }}
          </button>
        </form>

        <div class="demo-info">
          <p><strong>Demo accounts:</strong></p>
          <p>admin&#64;pixelsoftwaredesign.com / admin123</p>
          <p>sales&#64;pixelsoftwaredesign.com / sales123</p>
        </div>
        <p class="copyright">&copy; 2026 Pixel Software Design</p>
      </div>
    </div>
  `,
  styles: [`
    .login-page { display: flex; justify-content: center; align-items: center; min-height: 100vh; background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%); }
    .login-card { background: white; border-radius: 16px; padding: 40px; width: 420px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
    .login-header { text-align: center; margin-bottom: 30px; }
    .login-header h1 { margin: 0; font-size: 2rem; color: #1e1b4b; }
    .login-header p { margin: 5px 0 0; color: #6b7280; font-size: 0.9rem; }
    .tabs { display: flex; gap: 0; margin-bottom: 25px; border-bottom: 2px solid #e5e7eb; }
    .tabs button { flex: 1; padding: 12px; border: none; background: none; cursor: pointer; font-size: 0.95rem; color: #6b7280; border-bottom: 2px solid transparent; margin-bottom: -2px; transition: all 0.2s; }
    .tabs button.active { color: #4f46e5; border-bottom-color: #4f46e5; font-weight: 600; }
    .field { margin-bottom: 18px; }
    .field label { display: block; margin-bottom: 6px; font-size: 0.85rem; font-weight: 500; color: #374151; }
    .field input, .field select { width: 100%; padding: 10px 14px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 0.95rem; outline: none; transition: border 0.2s; }
    .field input:focus, .field select:focus { border-color: #4f46e5; box-shadow: 0 0 0 3px rgba(79,70,229,0.1); }
    .error { color: #dc2626; font-size: 0.85rem; margin-bottom: 15px; padding: 10px; background: #fef2f2; border-radius: 6px; }
    .btn-primary { width: 100%; padding: 12px; background: #4f46e5; color: white; border: none; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: background 0.2s; }
    .btn-primary:hover { background: #4338ca; }
    .btn-primary:disabled { background: #9ca3af; cursor: not-allowed; }
    .demo-info { margin-top: 25px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; }
    .demo-info p { margin: 4px 0; font-size: 0.8rem; color: #6b7280; }
    .copyright { margin: 20px 0 0; text-align: center; font-size: 0.75rem; color: #9ca3af; }
  `]
})
export class LoginComponent {
  mode: 'login' | 'register' = 'login';
  loginEmail = '';
  loginPassword = '';
  regUsername = '';
  regEmail = '';
  regPassword = '';
  regRole = 'SALES';
  errorMessage = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onLogin(): void {
    this.loading = true;
    this.errorMessage = '';
    this.authService.login(this.loginEmail, this.loginPassword).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Invalid credentials';
        this.loading = false;
      }
    });
  }

  onRegister(): void {
    this.loading = true;
    this.errorMessage = '';
    this.authService.register(this.regUsername, this.regEmail, this.regPassword, this.regRole).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Registration failed';
        this.loading = false;
      }
    });
  }
}
