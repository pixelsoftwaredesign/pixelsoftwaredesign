import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrossAppService } from '../../services/cross-app.service';

@Component({
  selector: 'app-crm-data',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="crm-data-page">
      <div class="page-header">
        <h2>PixManager CRM Data</h2>
        <p>Live data from the CRM system</p>
      </div>

      <div class="summary-cards">
        <div class="card">
          <div class="card-icon" style="background: #ccfbf1; color: #0d9488;">C</div>
          <div class="card-info">
            <span class="card-value">{{ contacts.length }}</span>
            <span class="card-label">Contacts</span>
          </div>
        </div>
        <div class="card">
          <div class="card-icon" style="background: #dbeafe; color: #2563eb;">CO</div>
          <div class="card-info">
            <span class="card-value">{{ companies.length }}</span>
            <span class="card-label">Companies</span>
          </div>
        </div>
        <div class="card">
          <div class="card-icon" style="background: #fef3c7; color: #d97706;">D</div>
          <div class="card-info">
            <span class="card-value">{{ deals.length }}</span>
            <span class="card-label">Deals</span>
          </div>
        </div>
        <div class="card">
          <div class="card-icon" style="background: #ede9fe; color: #7c3aed;">I</div>
          <div class="card-info">
            <span class="card-value">{{ invoices.length }}</span>
            <span class="card-label">Invoices</span>
          </div>
        </div>
      </div>

      <div class="tabs">
        <button [class.active]="activeTab === 'contacts'" (click)="activeTab = 'contacts'">Contacts</button>
        <button [class.active]="activeTab === 'companies'" (click)="activeTab = 'companies'">Companies</button>
        <button [class.active]="activeTab === 'deals'" (click)="activeTab = 'deals'">Deals</button>
        <button [class.active]="activeTab === 'invoices'" (click)="activeTab = 'invoices'">Invoices</button>
      </div>

      <div class="tab-content" *ngIf="!loading; else loadingTpl">
        <div *ngIf="activeTab === 'contacts'">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Position</th>
                <th>Company</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let c of contacts">
                <td><strong>{{ c.firstName }} {{ c.lastName }}</strong></td>
                <td>{{ c.email }}</td>
                <td>{{ c.phone }}</td>
                <td>{{ c.position }}</td>
                <td>{{ c.company?.name || 'N/A' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div *ngIf="activeTab === 'companies'">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Industry</th>
                <th>City</th>
                <th>Country</th>
                <th>Revenue</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let c of companies">
                <td><strong>{{ c.name }}</strong></td>
                <td>{{ c.industry }}</td>
                <td>{{ c.city }}</td>
                <td>{{ c.country }}</td>
                <td>{{ c.annualRevenue | number:'1.0-0' }}</td>
                <td><span class="status-badge" [attr.data-status]="c.status">{{ c.status }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div *ngIf="activeTab === 'deals'">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Company</th>
                <th>Value</th>
                <th>Probability</th>
                <th>Weighted</th>
                <th>Stage</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let d of deals">
                <td><strong>{{ d.title }}</strong></td>
                <td>{{ d.company?.name || 'N/A' }}</td>
                <td>{{ d.dealValue | number:'1.2-2' }}</td>
                <td>{{ d.probability }}%</td>
                <td>{{ d.weightedValue | number:'1.2-2' }}</td>
                <td><span class="stage-badge" [attr.data-stage]="d.stage">{{ d.stage }}</span></td>
                <td>{{ d.priority }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div *ngIf="activeTab === 'invoices'">
          <table>
            <thead>
              <tr>
                <th>Number</th>
                <th>Type</th>
                <th>Company</th>
                <th>Total</th>
                <th>Tax</th>
                <th>Status</th>
                <th>Issue Date</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let i of invoices">
                <td><span class="sku-badge">{{ i.invoiceNumber }}</span></td>
                <td>{{ i.type }}</td>
                <td>{{ i.company?.name || 'N/A' }}</td>
                <td><strong>{{ i.totalAmount | number:'1.2-2' }}</strong></td>
                <td>{{ i.taxAmount | number:'1.2-2' }}</td>
                <td><span class="status-badge" [attr.data-status]="i.status">{{ i.status }}</span></td>
                <td>{{ i.issueDate }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <ng-template #loadingTpl>
        <div class="loading">Loading PixManager CRM data...</div>
      </ng-template>
    </div>
  `,
  styles: [`
    .crm-data-page { padding: 30px; }
    .page-header { margin-bottom: 30px; }
    .page-header h2 { margin: 0; font-size: 1.8rem; color: #134e4a; }
    .page-header p { margin: 5px 0 0; color: #6b7280; }
    .summary-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 30px; }
    .card { background: white; border-radius: 12px; padding: 20px; display: flex; align-items: center; gap: 15px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .card-icon { width: 48px; height: 48px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 1rem; }
    .card-info { display: flex; flex-direction: column; }
    .card-value { font-size: 1.5rem; font-weight: 700; color: #134e4a; }
    .card-label { font-size: 0.8rem; color: #6b7280; }
    .tabs { display: flex; gap: 5px; margin-bottom: 20px; border-bottom: 2px solid #e5e7eb; padding-bottom: 0; }
    .tabs button { padding: 10px 20px; background: none; border: none; border-bottom: 2px solid transparent; margin-bottom: -2px; cursor: pointer; font-size: 0.9rem; color: #6b7280; transition: all 0.2s; }
    .tabs button:hover { color: #0d9488; }
    .tabs button.active { color: #0d9488; border-bottom-color: #0d9488; font-weight: 600; }
    table { width: 100%; border-collapse: collapse; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    th { padding: 12px 16px; text-align: left; background: #f8fafc; color: #6b7280; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e5e7eb; }
    td { padding: 12px 16px; border-bottom: 1px solid #f3f4f6; font-size: 0.9rem; color: #374151; }
    tr:hover td { background: #f9fafb; }
    .sku-badge { background: #ccfbf1; color: #0d9488; padding: 2px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: 500; }
    .status-badge { padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: 500; }
    .status-badge[data-status="ACTIVE"], .status-badge[data-status="WON"], .status-badge[data-status="PAID"] { background: #d1fae5; color: #059669; }
    .status-badge[data-status="DRAFT"], .status-badge[data-status="SENT"] { background: #fef3c7; color: #d97706; }
    .status-badge[data-status="LOST"], .status-badge[data-status="CANCELLED"], .status-badge[data-status="OVERDUE"] { background: #fee2e2; color: #dc2626; }
    .status-badge[data-status="INACTIVE"] { background: #f3f4f6; color: #6b7280; }
    .stage-badge { padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: 500; }
    .stage-badge[data-stage="WON"] { background: #d1fae5; color: #059669; }
    .stage-badge[data-stage="LOST"] { background: #fee2e2; color: #dc2626; }
    .stage-badge[data-stage="PROSPECTING"], .stage-badge[data-stage="QUALIFICATION"] { background: #dbeafe; color: #2563eb; }
    .stage-badge[data-stage="PROPOSAL"], .stage-badge[data-stage="NEGOTIATION"] { background: #fef3c7; color: #d97706; }
    .loading { text-align: center; padding: 60px; color: #6b7280; font-size: 1.1rem; }
  `]
})
export class CrmDataComponent implements OnInit {
  contacts: any[] = [];
  companies: any[] = [];
  deals: any[] = [];
  invoices: any[] = [];
  activeTab = 'contacts';
  loading = true;

  constructor(private crossAppService: CrossAppService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.crossAppService.getContacts().subscribe({
      next: data => { this.contacts = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
    this.crossAppService.getCompanies().subscribe(data => this.companies = data);
    this.crossAppService.getDeals().subscribe(data => this.deals = data);
    this.crossAppService.getInvoices().subscribe(data => this.invoices = data);
  }
}
