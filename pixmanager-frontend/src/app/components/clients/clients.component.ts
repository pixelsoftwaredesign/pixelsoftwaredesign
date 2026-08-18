import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CompanyService } from '../../services/company.service';
import { Company } from '../../models/models';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="padding:20px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
        <h2>Client Management ({{filtered.length}})</h2>
        <button style="background:#4f46e5;color:white;border:none;padding:10px 20px;border-radius:6px;cursor:pointer" (click)="showForm=!showForm">
          {{showForm ? 'Cancel' : '+ Add Company'}}
        </button>
      </div>

      <!-- Filters -->
      <div style="display:flex;gap:10px;margin-bottom:15px;flex-wrap:wrap">
        <input [(ngModel)]="search" (input)="applyFilter()" placeholder="Search..." style="padding:8px 12px;border:1px solid #ddd;border-radius:4px;flex:1;min-width:200px">
        <select [(ngModel)]="filterType" (change)="applyFilter()" style="padding:8px;border:1px solid #ddd;border-radius:4px">
          <option value="">All Types</option><option value="B2B">B2B</option><option value="B2C">B2C</option><option value="B2B2C">B2B2C</option>
        </select>
        <select [(ngModel)]="filterIndustry" (change)="applyFilter()" style="padding:8px;border:1px solid #ddd;border-radius:4px">
          <option value="">All Industries</option>
          <option *ngFor="let i of industries" [value]="i">{{i}}</option>
        </select>
        <select [(ngModel)]="filterStatus" (change)="applyFilter()" style="padding:8px;border:1px solid #ddd;border-radius:4px">
          <option value="">All Status</option><option value="ACTIVE">Active</option><option value="LEAD">Lead</option><option value="INACTIVE">Inactive</option>
        </select>
        <select [(ngModel)]="filterSegment" (change)="applyFilter()" style="padding:8px;border:1px solid #ddd;border-radius:4px">
          <option value="">All Segments</option><option value="Enterprise">Enterprise</option><option value="Mid-Market">Mid-Market</option><option value="SMB">SMB</option><option value="Startup">Startup</option>
        </select>
      </div>

      <!-- Form -->
      <div *ngIf="showForm" style="background:#f8f9fa;padding:20px;border-radius:8px;margin-bottom:20px">
        <form (ngSubmit)="save()">
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:15px">
            <input [(ngModel)]="cur.name" name="name" placeholder="Company Name *" required style="padding:10px;border:1px solid #ddd;border-radius:4px">
            <select [(ngModel)]="cur.type" name="type" style="padding:10px;border:1px solid #ddd;border-radius:4px">
              <option value="B2B">B2B</option><option value="B2C">B2C</option><option value="B2B2C">B2B2C</option>
            </select>
            <select [(ngModel)]="cur.industry" name="industry" style="padding:10px;border:1px solid #ddd;border-radius:4px">
              <option value="Technology">Technology</option><option value="Trading">Trading</option><option value="Digital Services">Digital Services</option>
              <option value="Retail">Retail</option><option value="Healthcare">Healthcare</option><option value="Food and Beverage">Food and Beverage</option>
              <option value="Construction">Construction</option><option value="Education">Education</option><option value="Manufacturing">Manufacturing</option>
              <option value="Consulting">Consulting</option><option value="Finance">Finance</option><option value="Real Estate">Real Estate</option>
              <option value="Transport">Transport</option><option value="Other">Other</option>
            </select>
            <select [(ngModel)]="cur.segment" name="segment" style="padding:10px;border:1px solid #ddd;border-radius:4px">
              <option value="Enterprise">Enterprise</option><option value="Mid-Market">Mid-Market</option><option value="SMB">SMB</option><option value="Startup">Startup</option>
            </select>
            <select [(ngModel)]="cur.size" name="size" style="padding:10px;border:1px solid #ddd;border-radius:4px">
              <option value="LARGE">Large (250+)</option><option value="MEDIUM">Medium (50-249)</option><option value="SMALL">Small (10-49)</option><option value="MICRO">Micro (&lt;10)</option>
            </select>
            <input [(ngModel)]="cur.taxId" name="taxId" placeholder="Tax ID" style="padding:10px;border:1px solid #ddd;border-radius:4px">
            <input [(ngModel)]="cur.email" name="email" placeholder="Email" style="padding:10px;border:1px solid #ddd;border-radius:4px">
            <input [(ngModel)]="cur.phone" name="phone" placeholder="Phone" style="padding:10px;border:1px solid #ddd;border-radius:4px">
            <input [(ngModel)]="cur.website" name="website" placeholder="Website" style="padding:10px;border:1px solid #ddd;border-radius:4px">
            <input [(ngModel)]="cur.city" name="city" placeholder="City" style="padding:10px;border:1px solid #ddd;border-radius:4px">
            <input [(ngModel)]="cur.country" name="country" placeholder="Country" style="padding:10px;border:1px solid #ddd;border-radius:4px">
            <input [(ngModel)]="cur.annualRevenue" name="annualRevenue" type="number" placeholder="Annual Revenue" style="padding:10px;border:1px solid #ddd;border-radius:4px">
          </div>
          <textarea [(ngModel)]="cur.address" name="address" placeholder="Address" rows="2" style="width:100%;padding:10px;border:1px solid #ddd;border-radius:4px;margin-bottom:10px"></textarea>
          <button type="submit" style="background:#4f46e5;color:white;border:none;padding:10px 20px;border-radius:6px;cursor:pointer">
            {{editId ? 'Update' : 'Create'}}
          </button>
        </form>
      </div>

      <!-- Table -->
      <table style="width:100%;border-collapse:collapse;background:white;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08)">
        <thead>
          <tr style="background:#f8f9fa">
            <th style="padding:12px;text-align:left;font-size:0.85rem">Name</th>
            <th style="padding:12px;text-align:left;font-size:0.85rem">Type</th>
            <th style="padding:12px;text-align:left;font-size:0.85rem">Industry</th>
            <th style="padding:12px;text-align:left;font-size:0.85rem">Segment</th>
            <th style="padding:12px;text-align:left;font-size:0.85rem">Size</th>
            <th style="padding:12px;text-align:left;font-size:0.85rem">City</th>
            <th style="padding:12px;text-align:left;font-size:0.85rem">Status</th>
            <th style="padding:12px;text-align:left;font-size:0.85rem">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let c of filtered" style="border-bottom:1px solid #f1f5f9">
            <td style="padding:12px;font-weight:500">{{c.name}}</td>
            <td style="padding:12px"><span [style.background]="c.type==='B2B'?'#dbeafe':c.type==='B2C'?'#d1fae5':'#fef3c7'" [style.color]="c.type==='B2B'?'#1d4ed8':c.type==='B2C'?'#059669':'#d97706'" style="padding:3px 10px;border-radius:12px;font-size:0.75rem;font-weight:600">{{c.type}}</span></td>
            <td style="padding:12px;font-size:0.85rem">{{c.industry}}</td>
            <td style="padding:12px;font-size:0.85rem">{{c.segment}}</td>
            <td style="padding:12px;font-size:0.85rem">{{c.size}}</td>
            <td style="padding:12px;font-size:0.85rem">{{c.city}}</td>
            <td style="padding:12px"><span [style.background]="c.status==='ACTIVE'?'#d1fae5':c.status==='LEAD'?'#fef3c7':'#fecaca'" [style.color]="c.status==='ACTIVE'?'#059669':c.status==='LEAD'?'#d97706':'#dc2626'" style="padding:3px 10px;border-radius:12px;font-size:0.75rem;font-weight:600">{{c.status}}</span></td>
            <td style="padding:12px">
              <button (click)="edit(c)" style="background:#f59e0b;color:white;border:none;padding:4px 8px;border-radius:4px;cursor:pointer;margin-right:4px;font-size:0.8rem">Edit</button>
              <button (click)="remove(c.id!)" style="background:#ef4444;color:white;border:none;padding:4px 8px;border-radius:4px;cursor:pointer;font-size:0.8rem">Del</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class ClientsComponent implements OnInit {
  companies: Company[] = [];
  filtered: Company[] = [];
  industries: string[] = [];
  cur: Company = { name: '', type: 'B2B', industry: 'Technology' };
  editId: number | null = null;
  showForm = false;
  search = ''; filterType = ''; filterIndustry = ''; filterStatus = ''; filterSegment = '';

  constructor(private service: CompanyService) {}
  ngOnInit() { this.load(); }
  load() { this.service.getAll().subscribe(d => { this.companies = d; this.industries = [...new Set(d.map(x => x.industry).filter((x): x is string => Boolean(x)))]; this.applyFilter(); }); }
  applyFilter() {
    this.filtered = this.companies.filter(c => {
      if (this.search && !c.name.toLowerCase().includes(this.search.toLowerCase())) return false;
      if (this.filterType && c.type !== this.filterType) return false;
      if (this.filterIndustry && c.industry !== this.filterIndustry) return false;
      if (this.filterStatus && c.status !== this.filterStatus) return false;
      if (this.filterSegment && c.segment !== this.filterSegment) return false;
      return true;
    });
  }
  save() { const op = this.editId ? this.service.update(this.editId, this.cur) : this.service.create(this.cur); op.subscribe(() => { this.load(); this.reset(); }); }
  edit(c: Company) { this.cur = { ...c }; this.editId = c.id!; this.showForm = true; }
  remove(id: number) { if (confirm('Delete?')) this.service.delete(id).subscribe(() => this.load()); }
  reset() { this.cur = { name: '', type: 'B2B', industry: 'Technology' }; this.editId = null; this.showForm = false; }
}
