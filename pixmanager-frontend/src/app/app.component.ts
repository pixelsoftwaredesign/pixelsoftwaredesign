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
            <h1>PixManager</h1>
            <p>CRM and Business</p>
          </div>
          <ul class="nav-links">
            <li routerLink="/dashboard" routerLinkActive="active">
              <span class="icon">D</span> Dashboard
            </li>
            <li routerLink="/clients" routerLinkActive="active">
              <span class="icon">C</span> Clients
            </li>
            <li routerLink="/pipeline" routerLinkActive="active">
              <span class="icon">P</span> Pipeline
            </li>
            <li routerLink="/projects" routerLinkActive="active">
              <span class="icon">T</span> Projects
            </li>
            <li routerLink="/finances" routerLinkActive="active">
              <span class="icon">$</span> Finances
            </li>
            <li routerLink="/analytics" routerLinkActive="active">
              <span class="icon">A</span> Analytics
            </li>
            <li routerLink="/erp-data" routerLinkActive="active">
              <span class="icon">E</span> ERP Data
            </li>
            <li routerLink="/settings" routerLinkActive="active">
              <span class="icon">S</span> Settings
            </li>
          </ul>
          <div class="app-switcher">
            <p class="switcher-label">Switch App</p>
            <a href="http://localhost:4201" class="switcher-link active-app">
              <span class="icon">E</span> PixERP
            </a>
          </div>
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
        <main class="main-content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </ng-container>
    <ng-template #loginView>
      <router-outlet></router-outlet>
    </ng-template>
  `,
  styles: [`
    .app-layout { display: flex; height: 100vh; }
    .sidebar { width: 260px; background: #1e1b4b; color: white; display: flex; flex-direction: column; flex-shrink: 0; }
    .logo { padding: 25px 20px; border-bottom: 1px solid rgba(255,255,255,0.1); }
    .logo h1 { margin: 0; font-size: 1.5rem; color: #818cf8; }
    .logo p { margin: 5px 0 0; font-size: 0.8rem; color: #a5b4fc; }
    .nav-links { list-style: none; padding: 15px 0; flex: 1; }
    .nav-links li { padding: 12px 20px; cursor: pointer; display: flex; align-items: center; gap: 12px; color: #c7d2fe; transition: all 0.2s; }
    .nav-links li:hover { background: rgba(255,255,255,0.1); color: white; }
    .nav-links li.active { background: rgba(129,140,248,0.2); color: #818cf8; border-right: 3px solid #818cf8; }
    .icon { font-size: 1.1rem; font-weight: bold; width: 20px; text-align: center; }
    .sidebar-footer { padding: 15px 20px; border-top: 1px solid rgba(255,255,255,0.1); }
    .user-info { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
    .user-avatar { width: 36px; height: 36px; border-radius: 50%; background: #4f46e5; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 0.9rem; }
    .user-details { display: flex; flex-direction: column; }
    .user-name { font-size: 0.85rem; color: #e0e7ff; font-weight: 500; }
    .user-role { font-size: 0.7rem; color: #818cf8; }
    .btn-logout { width: 100%; padding: 8px; background: rgba(220,38,38,0.15); color: #fca5a5; border: 1px solid rgba(220,38,38,0.3); border-radius: 6px; cursor: pointer; font-size: 0.8rem; margin-bottom: 10px; transition: all 0.2s; }
    .btn-logout:hover { background: rgba(220,38,38,0.3); color: #fecaca; }
    .brand { margin: 0; font-size: 0.75rem; color: #6366f1; }
    .app-switcher { padding: 10px 20px; border-top: 1px solid rgba(255,255,255,0.1); }
    .switcher-label { margin: 0 0 8px; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 1px; color: #6b7280; }
    .switcher-link { display: flex; align-items: center; gap: 10px; padding: 8px 12px; border-radius: 6px; text-decoration: none; color: #c7d2fe; font-size: 0.85rem; transition: all 0.2s; }
    .switcher-link:hover { background: rgba(255,255,255,0.1); color: white; }
    .switcher-link.active-app { background: rgba(13,148,136,0.2); color: #5eead4; }
    .main-content { flex: 1; background: #f8fafc; overflow-y: auto; }
  `]
})
export class AppComponent {
  isLoginPage = false;

  constructor(public authService: AuthService, private router: Router) {
    this.router.events.subscribe(() => {
      this.isLoginPage = this.router.url === '/login';
    });
  }
}
