import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding:20px">
      <h2>Settings</h2>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px;margin-top:20px">
        <div style="background:white;border-radius:8px;padding:25px;box-shadow:0 1px 3px rgba(0,0,0,0.08)">
          <h3>Company Profile</h3>
          <p style="color:#64748b">Manage company info and branding.</p>
          <button style="background:white;border:1px solid #ddd;padding:8px 16px;border-radius:4px;cursor:pointer">Edit Profile</button>
        </div>
        <div style="background:white;border-radius:8px;padding:25px;box-shadow:0 1px 3px rgba(0,0,0,0.08)">
          <h3>User Management (RBAC)</h3>
          <p style="color:#64748b">Admin, Manager, Sales, Developer roles.</p>
          <button style="background:white;border:1px solid #ddd;padding:8px 16px;border-radius:4px;cursor:pointer">Manage Users</button>
        </div>
        <div style="background:white;border-radius:8px;padding:25px;box-shadow:0 1px 3px rgba(0,0,0,0.08)">
          <h3>Integrations</h3>
          <p style="color:#64748b">Email, calendar, accounting, e-invoicing.</p>
          <button style="background:white;border:1px solid #ddd;padding:8px 16px;border-radius:4px;cursor:pointer">Configure</button>
        </div>
        <div style="background:white;border-radius:8px;padding:25px;box-shadow:0 1px 3px rgba(0,0,0,0.08)">
          <h3>Tax Configuration</h3>
          <p style="color:#64748b">TVA rates, fiscal year, e-facturation.</p>
          <button style="background:white;border:1px solid #ddd;padding:8px 16px;border-radius:4px;cursor:pointer">Settings</button>
        </div>
      </div>
    </div>
  `
})
export class SettingsComponent {}
