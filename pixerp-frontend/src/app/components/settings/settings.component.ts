import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, UserInfo } from '../../services/auth.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="settings-page">
      <div class="page-header">
        <h2>Settings</h2>
        <p>Manage system preferences and company configuration</p>
      </div>

      <div class="cards-grid">
        <!-- Company Profile -->
        <div class="card">
          <div class="card-header">
            <div class="card-icon company-icon">&#9733;</div>
            <div>
              <h3>Company Profile</h3>
              <p class="card-subtitle">Manage your company information</p>
            </div>
          </div>
          <div class="card-body">
            <div class="field">
              <label>Company Name</label>
              <input type="text" [value]="companyName" placeholder="Company name" disabled>
            </div>
            <div class="field">
              <label>Address</label>
              <input type="text" [value]="companyAddress" placeholder="Company address" disabled>
            </div>
            <div class="field">
              <label>Tax ID (MF)</label>
              <input type="text" [value]="taxId" placeholder="Tax ID" disabled>
            </div>
            <div class="field">
              <label>Phone</label>
              <input type="text" [value]="companyPhone" placeholder="Phone number" disabled>
            </div>
            <div class="field">
              <label>Email</label>
              <input type="email" [value]="companyEmail" placeholder="Email" disabled>
            </div>
          </div>
          <div class="card-footer">
            <span class="card-note">Contact your administrator to update company info</span>
          </div>
        </div>

        <!-- Tax Configuration -->
        <div class="card">
          <div class="card-header">
            <div class="card-icon tax-icon">%</div>
            <div>
              <h3>Tax Configuration</h3>
              <p class="card-subtitle">VAT and fiscal settings</p>
            </div>
          </div>
          <div class="card-body">
            <div class="field">
              <label>Standard TVA Rate</label>
              <div class="input-with-badge">
                <input type="text" value="19%" disabled>
                <span class="rate-badge">Standard</span>
              </div>
            </div>
            <div class="field">
              <label>Reduced TVA Rate</label>
              <div class="input-with-badge">
                <input type="text" value="7%" disabled>
                <span class="rate-badge reduced">Reduced</span>
              </div>
            </div>
            <div class="field">
              <label>Fiscal Year</label>
              <input type="text" value="January - December" disabled>
            </div>
            <div class="field">
              <label>E-Invoicing</label>
              <div class="status-row">
                <span class="status-badge active">Enabled</span>
                <span class="status-text">Portail Unique (PPF)</span>
              </div>
            </div>
          </div>
          <div class="card-footer">
            <span class="card-note">Tax rates are configured per Tunisian fiscal regulations</span>
          </div>
        </div>

        <!-- User Management -->
        <div class="card">
          <div class="card-header">
            <div class="card-icon user-icon">&#9787;</div>
            <div>
              <h3>User Management</h3>
              <p class="card-subtitle">Current user information</p>
            </div>
          </div>
          <div class="card-body">
            <div *ngIf="currentUser" class="user-profile">
              <div class="user-avatar">{{ currentUser.username.charAt(0).toUpperCase() }}</div>
              <div class="user-details">
                <span class="user-name">{{ currentUser.username }}</span>
                <span class="user-email">{{ currentUser.email }}</span>
              </div>
            </div>
            <div *ngIf="!currentUser" class="user-profile">
              <div class="user-avatar">?</div>
              <div class="user-details">
                <span class="user-name">Not logged in</span>
              </div>
            </div>
            <div class="field">
              <label>User ID</label>
              <input type="text" [value]="currentUser?.id || '-'" disabled>
            </div>
            <div class="field">
              <label>Role</label>
              <div class="input-with-badge">
                <input type="text" [value]="currentUser?.role || '-'" disabled>
                <span class="role-badge" [ngClass]="'role-' + (currentUser?.role || '').toLowerCase()">{{ currentUser?.role || '-' }}</span>
              </div>
            </div>
            <div class="field">
              <label>Username</label>
              <input type="text" [value]="currentUser?.username || '-'" disabled>
            </div>
            <div class="field">
              <label>Email</label>
              <input type="text" [value]="currentUser?.email || '-'" disabled>
            </div>
          </div>
          <div class="card-footer">
            <span class="card-note">Contact administrator for role changes</span>
          </div>
        </div>

        <!-- System Info -->
        <div class="card">
          <div class="card-header">
            <div class="card-icon system-icon">&#9881;</div>
            <div>
              <h3>System Information</h3>
              <p class="card-subtitle">Platform and version details</p>
            </div>
          </div>
          <div class="card-body">
            <div class="info-list">
              <div class="info-row">
                <span class="info-label">Application</span>
                <span class="info-value">PixERP</span>
              </div>
              <div class="info-row">
                <span class="info-label">Version</span>
                <span class="info-value version">1.0.0</span>
              </div>
              <div class="info-divider"></div>
              <div class="info-row">
                <span class="info-label">Frontend</span>
                <span class="info-value">Angular 18</span>
              </div>
              <div class="info-row">
                <span class="info-label">Backend</span>
                <span class="info-value">Spring Boot 3.2.0</span>
              </div>
              <div class="info-row">
                <span class="info-label">Database</span>
                <span class="info-value">H2 Database</span>
              </div>
              <div class="info-divider"></div>
              <div class="info-row">
                <span class="info-label">Developer</span>
                <span class="info-value">Pixel Software Design</span>
              </div>
            </div>
          </div>
          <div class="card-footer">
            <span class="card-note">All systems operational</span>
            <span class="operational-dot"></span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .settings-page { padding: 24px; }
    .page-header { margin-bottom: 24px; }
    .page-header h2 { margin: 0; color: #134e4a; font-size: 1.5rem; }
    .page-header p { margin: 4px 0 0; color: #6b7280; font-size: 0.9rem; }

    .cards-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px; }

    .card { background: white; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); border: 1px solid #e5e7eb; overflow: hidden; }
    .card-header { display: flex; align-items: center; gap: 14px; padding: 20px 24px 0; }
    .card-icon { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; font-weight: 700; flex-shrink: 0; }
    .company-icon { background: #f0fdfa; color: #0d9488; }
    .tax-icon { background: #fef9c3; color: #ca8a04; font-size: 1.5rem; }
    .user-icon { background: #ede9fe; color: #7c3aed; }
    .system-icon { background: #dbeafe; color: #1d4ed8; }
    .card-header h3 { margin: 0; font-size: 1.05rem; color: #134e4a; }
    .card-subtitle { margin: 2px 0 0; font-size: 0.78rem; color: #6b7280; }

    .card-body { padding: 18px 24px; }
    .field { margin-bottom: 14px; }
    .field:last-child { margin-bottom: 0; }
    .field label { display: block; font-size: 0.78rem; font-weight: 500; color: #6b7280; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 0.3px; }
    .field input { width: 100%; padding: 9px 12px; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 0.88rem; background: #f9fafb; color: #374151; outline: none; }
    .field input:disabled { opacity: 0.8; cursor: default; }

    .input-with-badge { display: flex; gap: 8px; align-items: center; }
    .input-with-badge input { flex: 1; }
    .rate-badge { padding: 4px 10px; border-radius: 12px; font-size: 0.72rem; font-weight: 600; background: #dcfce7; color: #15803d; white-space: nowrap; }
    .rate-badge.reduced { background: #fef9c3; color: #ca8a04; }
    .role-badge { padding: 4px 10px; border-radius: 12px; font-size: 0.72rem; font-weight: 600; white-space: nowrap; }
    .role-admin { background: #fee2e2; color: #dc2626; }
    .role-manager { background: #fef9c3; color: #ca8a04; }
    .role-accountant { background: #dbeafe; color: #1d4ed8; }
    .role-staff { background: #dcfce7; color: #15803d; }
    .role-cashier { background: #ede9fe; color: #7c3aed; }
    .role-hr { background: #fce7f3; color: #be185d; }

    .status-row { display: flex; align-items: center; gap: 8px; }
    .status-badge { padding: 4px 10px; border-radius: 12px; font-size: 0.72rem; font-weight: 600; }
    .status-badge.active { background: #dcfce7; color: #15803d; }
    .status-text { font-size: 0.85rem; color: #374151; }

    .user-profile { display: flex; align-items: center; gap: 14px; padding: 14px; background: #f8fafc; border-radius: 8px; margin-bottom: 16px; border: 1px solid #e5e7eb; }
    .user-avatar { width: 48px; height: 48px; border-radius: 50%; background: #0d9488; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.1rem; flex-shrink: 0; }
    .user-details { display: flex; flex-direction: column; }
    .user-name { font-weight: 600; color: #134e4a; font-size: 0.95rem; }
    .user-email { font-size: 0.82rem; color: #6b7280; }

    .info-list { display: flex; flex-direction: column; }
    .info-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; }
    .info-label { font-size: 0.85rem; color: #6b7280; }
    .info-value { font-size: 0.85rem; color: #134e4a; font-weight: 500; }
    .info-value.version { background: #f0fdfa; color: #0d9488; padding: 2px 10px; border-radius: 10px; font-weight: 600; font-size: 0.82rem; }
    .info-divider { height: 1px; background: #f3f4f6; margin: 4px 0; }

    .card-footer { padding: 14px 24px; border-top: 1px solid #f3f4f6; display: flex; align-items: center; justify-content: space-between; }
    .card-note { font-size: 0.78rem; color: #9ca3af; }
    .operational-dot { width: 8px; height: 8px; border-radius: 50%; background: #16a34a; }
  `]
})
export class SettingsComponent implements OnInit {
  currentUser: UserInfo | null = null;

  companyName = 'Pixel Software Design';
  companyAddress = 'Tunis, Tunisia';
  taxId = '12345678/M/ART';
  companyPhone = '+216 71 000 000';
  companyEmail = 'contact@pixelsoftwaredesign.com';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }
}
