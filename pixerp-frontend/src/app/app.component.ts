import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <ng-container *ngIf="!isLoginPage; else loginView">
      <div class="app-layout" *ngIf="authService.isLoggedIn()">
        <nav class="sidebar">
          <div class="logo">
            <h1>PixERP</h1>
            <p>Enterprise Resource Planning</p>
          </div>
          <ul class="nav-links">
            <li routerLink="/dashboard" routerLinkActive="active"><span class="icon">D</span> Dashboard</li>
            <li routerLink="/inventory" routerLinkActive="active"><span class="icon">I</span> Inventory</li>
            <li routerLink="/pos" routerLinkActive="active"><span class="icon">$</span> Point of Sale</li>
            <li routerLink="/hrm" routerLinkActive="active"><span class="icon">H</span> HRM</li>
            <li routerLink="/accounting" routerLinkActive="active"><span class="icon">A</span> Accounting</li>
            <li routerLink="/settings" routerLinkActive="active"><span class="icon">S</span> Settings</li>
          </ul>
          <div class="sidebar-footer">
            <div class="user-info" *ngIf="authService.getCurrentUser() as user">
              <div class="user-avatar">{{ user.username.charAt(0).toUpperCase() }}</div>
              <div class="user-details">
                <span class="user-name">{{ user.username }}</span>
                <span class="user-role">{{ user.role }}</span>
              </div>
            </div>
            <button class="btn-logout" (click)="authService.logout()">Logout</button>
            <p class="brand">Pixel Software Design</p>
          </div>
        </nav>
        <main class="main-content"><router-outlet></router-outlet></main>
      </div>
    </ng-container>
    <ng-template #loginView><router-outlet></router-outlet></ng-template>
  `,
  styles: [`
    .app-layout { display: flex; height: 100vh; }
    .sidebar { width: 260px; background: #134e4a; color: white; display: flex; flex-direction: column; flex-shrink: 0; }
    .logo { padding: 25px 20px; border-bottom: 1px solid rgba(255,255,255,0.1); }
    .logo h1 { margin: 0; font-size: 1.5rem; color: #5eead4; }
    .logo p { margin: 5px 0 0; font-size: 0.8rem; color: #99f6e4; }
    .nav-links { list-style: none; padding: 15px 0; flex: 1; }
    .nav-links li { padding: 12px 20px; cursor: pointer; display: flex; align-items: center; gap: 12px; color: #ccfbf1; transition: all 0.2s; }
    .nav-links li:hover { background: rgba(255,255,255,0.1); color: white; }
    .nav-links li.active { background: rgba(94,234,212,0.15); color: #5eead4; border-right: 3px solid #5eead4; }
    .icon { font-size: 1.1rem; font-weight: bold; width: 20px; text-align: center; }
    .sidebar-footer { padding: 15px 20px; border-top: 1px solid rgba(255,255,255,0.1); }
    .user-info { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
    .user-avatar { width: 36px; height: 36px; border-radius: 50%; background: #0d9488; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 0.9rem; }
    .user-details { display: flex; flex-direction: column; }
    .user-name { font-size: 0.85rem; color: #ccfbf1; font-weight: 500; }
    .user-role { font-size: 0.7rem; color: #5eead4; }
    .btn-logout { width: 100%; padding: 8px; background: rgba(220,38,38,0.15); color: #fca5a5; border: 1px solid rgba(220,38,38,0.3); border-radius: 6px; cursor: pointer; font-size: 0.8rem; margin-bottom: 10px; transition: all 0.2s; }
    .btn-logout:hover { background: rgba(220,38,38,0.3); color: #fecaca; }
    .brand { margin: 0; font-size: 0.75rem; color: #0d9488; }
    .main-content { flex: 1; background: #f8fafc; overflow-y: auto; }
  `]
})
export class AppComponent {
  isLoginPage = false;
  constructor(public authService: AuthService, private router: Router) {
    this.router.events.subscribe(() => { this.isLoginPage = this.router.url === '/login'; });
  }
}
