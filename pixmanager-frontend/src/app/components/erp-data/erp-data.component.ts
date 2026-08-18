import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrossAppService } from '../../services/cross-app.service';

@Component({
  selector: 'app-erp-data',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="erp-data-page">
      <div class="page-header">
        <h2>PixERP Data</h2>
        <p>Live data from the ERP system</p>
      </div>

      <div class="summary-cards">
        <div class="card">
          <div class="card-icon" style="background: #e0e7ff; color: #4f46e5;">P</div>
          <div class="card-info">
            <span class="card-value">{{ products.length }}</span>
            <span class="card-label">Products</span>
          </div>
        </div>
        <div class="card">
          <div class="card-icon" style="background: #d1fae5; color: #059669;">S</div>
          <div class="card-info">
            <span class="card-value">{{ sales.length }}</span>
            <span class="card-label">Sales</span>
          </div>
        </div>
        <div class="card">
          <div class="card-icon" style="background: #fef3c7; color: #d97706;">E</div>
          <div class="card-info">
            <span class="card-value">{{ expenses.length }}</span>
            <span class="card-label">Expenses</span>
          </div>
        </div>
        <div class="card">
          <div class="card-icon" style="background: #ede9fe; color: #7c3aed;">D</div>
          <div class="card-info">
            <span class="card-value">{{ departments.length }}</span>
            <span class="card-label">Departments</span>
          </div>
        </div>
      </div>

      <div class="tabs">
        <button [class.active]="activeTab === 'products'" (click)="activeTab = 'products'">Products</button>
        <button [class.active]="activeTab === 'sales'" (click)="activeTab = 'sales'">Sales</button>
        <button [class.active]="activeTab === 'expenses'" (click)="activeTab = 'expenses'">Expenses</button>
        <button [class.active]="activeTab === 'departments'" (click)="activeTab = 'departments'">Departments</button>
      </div>

      <div class="tab-content" *ngIf="!loading; else loadingTpl">
        <div *ngIf="activeTab === 'products'">
          <table>
            <thead>
              <tr>
                <th>SKU</th>
                <th>Name</th>
                <th>Category</th>
                <th>Cost Price</th>
                <th>Selling Price</th>
                <th>Stock</th>
                <th>Unit</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let p of products">
                <td><span class="sku-badge">{{ p.sku }}</span></td>
                <td>{{ p.name }}</td>
                <td>{{ p.category?.name || 'N/A' }}</td>
                <td>{{ p.costPrice | number:'1.2-2' }}</td>
                <td>{{ p.sellingPrice | number:'1.2-2' }}</td>
                <td><span [class.low-stock]="p.stockQuantity < (p.minStock || 0)">{{ p.stockQuantity }}</span></td>
                <td>{{ p.unit }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div *ngIf="activeTab === 'sales'">
          <table>
            <thead>
              <tr>
                <th>Sale #</th>
                <th>Customer</th>
                <th>Subtotal</th>
                <th>Tax</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let s of sales">
                <td><span class="sku-badge">{{ s.saleNumber }}</span></td>
                <td>{{ s.customerName || 'Walk-in' }}</td>
                <td>{{ s.subtotal | number:'1.2-2' }}</td>
                <td>{{ s.taxAmount | number:'1.2-2' }}</td>
                <td><strong>{{ s.total | number:'1.2-2' }}</strong></td>
                <td>{{ s.paymentMethod }}</td>
                <td><span class="status-badge" [attr.data-status]="s.status">{{ s.status }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div *ngIf="activeTab === 'expenses'">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let e of expenses">
                <td>{{ e.date }}</td>
                <td>{{ e.description }}</td>
                <td>{{ e.category }}</td>
                <td><strong>{{ e.amount | number:'1.2-2' }}</strong></td>
                <td>{{ e.paymentMethod }}</td>
                <td><span class="status-badge" [attr.data-status]="e.status">{{ e.status }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div *ngIf="activeTab === 'departments'">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let d of departments">
                <td><strong>{{ d.name }}</strong></td>
                <td>{{ d.description }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <ng-template #loadingTpl>
        <div class="loading">Loading PixERP data...</div>
      </ng-template>
    </div>
  `,
  styles: [`
    .erp-data-page { padding: 30px; }
    .page-header { margin-bottom: 30px; }
    .page-header h2 { margin: 0; font-size: 1.8rem; color: #1e1b4b; }
    .page-header p { margin: 5px 0 0; color: #6b7280; }
    .summary-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 30px; }
    .card { background: white; border-radius: 12px; padding: 20px; display: flex; align-items: center; gap: 15px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .card-icon { width: 48px; height: 48px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 1.1rem; }
    .card-info { display: flex; flex-direction: column; }
    .card-value { font-size: 1.5rem; font-weight: 700; color: #1e1b4b; }
    .card-label { font-size: 0.8rem; color: #6b7280; }
    .tabs { display: flex; gap: 5px; margin-bottom: 20px; border-bottom: 2px solid #e5e7eb; padding-bottom: 0; }
    .tabs button { padding: 10px 20px; background: none; border: none; border-bottom: 2px solid transparent; margin-bottom: -2px; cursor: pointer; font-size: 0.9rem; color: #6b7280; transition: all 0.2s; }
    .tabs button:hover { color: #4f46e5; }
    .tabs button.active { color: #4f46e5; border-bottom-color: #4f46e5; font-weight: 600; }
    table { width: 100%; border-collapse: collapse; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    th { padding: 12px 16px; text-align: left; background: #f8fafc; color: #6b7280; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e5e7eb; }
    td { padding: 12px 16px; border-bottom: 1px solid #f3f4f6; font-size: 0.9rem; color: #374151; }
    tr:hover td { background: #f9fafb; }
    .sku-badge { background: #e0e7ff; color: #4f46e5; padding: 2px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: 500; }
    .low-stock { color: #dc2626; font-weight: 600; }
    .status-badge { padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: 500; }
    .status-badge[data-status="COMPLETED"], .status-badge[data-status="APPROVED"] { background: #d1fae5; color: #059669; }
    .status-badge[data-status="PENDING"] { background: #fef3c7; color: #d97706; }
    .status-badge[data-status="CANCELLED"], .status-badge[data-status="REJECTED"], .status-badge[data-status="REFUNDED"] { background: #fee2e2; color: #dc2626; }
    .loading { text-align: center; padding: 60px; color: #6b7280; font-size: 1.1rem; }
  `]
})
export class ErpDataComponent implements OnInit {
  products: any[] = [];
  sales: any[] = [];
  expenses: any[] = [];
  departments: any[] = [];
  activeTab = 'products';
  loading = true;

  constructor(private crossAppService: CrossAppService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.crossAppService.getProducts().subscribe({
      next: data => { this.products = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
    this.crossAppService.getSales().subscribe(data => this.sales = data);
    this.crossAppService.getExpenses().subscribe(data => this.expenses = data);
    this.crossAppService.getDepartments().subscribe(data => this.departments = data);
  }
}
