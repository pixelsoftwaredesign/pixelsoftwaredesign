import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { SaleService } from '../../services/sale.service';
import { EmployeeService } from '../../services/employee.service';
import { ExpenseService } from '../../services/expense.service';
import { Product, Sale, Employee, Expense } from '../../models/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="dashboard">
      <div class="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back. Here's your business overview for today.</p>
      </div>

      <div class="kpi-grid">
        <div class="kpi-card border-teal">
          <div class="kpi-icon bg-teal"><span class="kpi-emoji">📦</span></div>
          <div class="kpi-info">
            <span class="kpi-label">Total Products</span>
            <span class="kpi-value">{{ totalProducts }}</span>
          </div>
        </div>
        <div class="kpi-card border-amber">
          <div class="kpi-icon bg-amber"><span class="kpi-emoji">⚠️</span></div>
          <div class="kpi-info">
            <span class="kpi-label">Low Stock Alerts</span>
            <span class="kpi-value">{{ lowStockCount }}</span>
          </div>
        </div>
        <div class="kpi-card border-green">
          <div class="kpi-icon bg-green"><span class="kpi-emoji">🧾</span></div>
          <div class="kpi-info">
            <span class="kpi-label">Today's Sales</span>
            <span class="kpi-value">{{ todaySalesCount }}</span>
          </div>
        </div>
        <div class="kpi-card border-blue">
          <div class="kpi-icon bg-blue"><span class="kpi-emoji">💰</span></div>
          <div class="kpi-info">
            <span class="kpi-label">Total Revenue</span>
            <span class="kpi-value">{{ totalRevenue | number:'1.2-2' }} TND</span>
          </div>
        </div>
        <div class="kpi-card border-purple">
          <div class="kpi-icon bg-purple"><span class="kpi-emoji">👥</span></div>
          <div class="kpi-info">
            <span class="kpi-label">Total Employees</span>
            <span class="kpi-value">{{ totalEmployees }}</span>
          </div>
        </div>
        <div class="kpi-card border-red">
          <div class="kpi-icon bg-red"><span class="kpi-emoji">📉</span></div>
          <div class="kpi-info">
            <span class="kpi-label">Total Expenses</span>
            <span class="kpi-value">{{ totalExpenses | number:'1.2-2' }} TND</span>
          </div>
        </div>
      </div>

      <div class="dashboard-columns">
        <div class="panel recent-sales">
          <div class="panel-header">
            <h2>Recent Sales</h2>
            <span class="panel-subtitle">Last 5 transactions</span>
          </div>
          <div class="table-wrapper" *ngIf="recentSales.length > 0; else noSales">
            <table>
              <thead>
                <tr>
                  <th>Sale #</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let sale of recentSales">
                  <td><span class="sale-number">{{ sale.saleNumber || 'N/A' }}</span></td>
                  <td>{{ sale.customerName || 'Walk-in' }}</td>
                  <td class="amount">{{ sale.total | number:'1.2-2' }} TND</td>
                  <td><span class="badge badge-payment">{{ sale.paymentMethod }}</span></td>
                  <td class="date-cell">{{ sale.createdAt | date:'short' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <ng-template #noSales>
            <div class="empty-state">
              <span class="empty-icon">🧾</span>
              <p>No sales recorded today</p>
            </div>
          </ng-template>
        </div>

        <div class="panel low-stock-alerts">
          <div class="panel-header">
            <h2>Low Stock Alerts</h2>
            <span class="panel-subtitle" *ngIf="lowStockProducts.length > 0">{{ lowStockProducts.length }} items need attention</span>
          </div>
          <div class="low-stock-list" *ngIf="lowStockProducts.length > 0; else noLowStock">
            <div class="low-stock-item" *ngFor="let product of lowStockProducts">
              <div class="low-stock-info">
                <span class="product-name">{{ product.name }}</span>
                <span class="product-sku">{{ product.sku || 'No SKU' }}</span>
              </div>
              <div class="stock-status">
                <span class="stock-badge critical">{{ product.stockQuantity }} left</span>
                <span class="min-stock">Min: {{ product.minStock || 0 }}</span>
              </div>
            </div>
          </div>
          <ng-template #noLowStock>
            <div class="empty-state">
              <span class="empty-icon">✅</span>
              <p>All products are well stocked</p>
            </div>
          </ng-template>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard { padding: 24px; max-width: 1400px; margin: 0 auto; }

    .dashboard-header { margin-bottom: 28px; }
    .dashboard-header h1 { margin: 0 0 4px; font-size: 1.75rem; color: #134e4a; font-weight: 700; }
    .dashboard-header p { margin: 0; color: #6b7280; font-size: 0.95rem; }

    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
      gap: 20px;
      margin-bottom: 28px;
    }

    .kpi-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
      border-left: 4px solid transparent;
      transition: transform 0.15s, box-shadow 0.15s;
    }
    .kpi-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }

    .border-teal { border-left-color: #0d9488; }
    .border-amber { border-left-color: #f59e0b; }
    .border-green { border-left-color: #22c55e; }
    .border-blue { border-left-color: #3b82f6; }
    .border-purple { border-left-color: #a855f7; }
    .border-red { border-left-color: #ef4444; }

    .kpi-icon {
      width: 48px; height: 48px; border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .kpi-emoji { font-size: 1.3rem; }
    .bg-teal { background: #f0fdfa; }
    .bg-amber { background: #fffbeb; }
    .bg-green { background: #f0fdf4; }
    .bg-blue { background: #eff6ff; }
    .bg-purple { background: #faf5ff; }
    .bg-red { background: #fef2f2; }

    .kpi-info { display: flex; flex-direction: column; }
    .kpi-label { font-size: 0.8rem; color: #6b7280; font-weight: 500; text-transform: uppercase; letter-spacing: 0.3px; }
    .kpi-value { font-size: 1.5rem; font-weight: 700; color: #134e4a; margin-top: 2px; }

    .dashboard-columns {
      display: grid;
      grid-template-columns: 1.4fr 1fr;
      gap: 24px;
    }

    .panel {
      background: white;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
      overflow: hidden;
    }

    .panel-header {
      padding: 20px 24px;
      border-bottom: 1px solid #f3f4f6;
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }
    .panel-header h2 { margin: 0; font-size: 1.1rem; color: #134e4a; font-weight: 600; }
    .panel-subtitle { font-size: 0.8rem; color: #9ca3af; }

    .table-wrapper { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; }
    th {
      text-align: left; padding: 12px 16px; font-size: 0.75rem;
      text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280;
      background: #f9fafb; font-weight: 600;
    }
    td { padding: 12px 16px; font-size: 0.88rem; color: #374151; border-top: 1px solid #f3f4f6; }
    tr:hover td { background: #f9fafb; }

    .sale-number { font-weight: 600; color: #0d9488; }
    .amount { font-weight: 600; color: #134e4a; }
    .date-cell { color: #9ca3af; font-size: 0.82rem; }

    .badge {
      display: inline-block; padding: 3px 10px; border-radius: 20px;
      font-size: 0.75rem; font-weight: 500;
    }
    .badge-payment { background: #f0fdfa; color: #0d9488; }

    .low-stock-list { padding: 8px 0; }
    .low-stock-item {
      display: flex; justify-content: space-between; align-items: center;
      padding: 14px 24px; border-bottom: 1px solid #f3f4f6;
      transition: background 0.15s;
    }
    .low-stock-item:last-child { border-bottom: none; }
    .low-stock-item:hover { background: #fef2f2; }

    .low-stock-info { display: flex; flex-direction: column; gap: 2px; }
    .product-name { font-weight: 600; color: #374151; font-size: 0.9rem; }
    .product-sku { font-size: 0.78rem; color: #9ca3af; }

    .stock-status { display: flex; align-items: center; gap: 10px; }
    .stock-badge {
      padding: 3px 10px; border-radius: 20px;
      font-size: 0.75rem; font-weight: 600;
    }
    .stock-badge.critical { background: #fef2f2; color: #dc2626; }
    .min-stock { font-size: 0.75rem; color: #9ca3af; }

    .empty-state {
      padding: 48px 24px; text-align: center; color: #9ca3af;
    }
    .empty-icon { font-size: 2rem; display: block; margin-bottom: 8px; }
    .empty-state p { margin: 0; font-size: 0.9rem; }

    @media (max-width: 900px) {
      .dashboard-columns { grid-template-columns: 1fr; }
    }
  `]
})
export class DashboardComponent implements OnInit {
  totalProducts = 0;
  lowStockCount = 0;
  todaySalesCount = 0;
  totalRevenue = 0;
  totalEmployees = 0;
  totalExpenses = 0;

  recentSales: Sale[] = [];
  lowStockProducts: Product[] = [];

  constructor(
    private productService: ProductService,
    private saleService: SaleService,
    private employeeService: EmployeeService,
    private expenseService: ExpenseService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    forkJoin({
      products: this.productService.getAll(),
      lowStock: this.productService.getLowStock(),
      sales: this.saleService.getAll(),
      employees: this.employeeService.getAll(),
      expenses: this.expenseService.getAll()
    }).subscribe({
      next: ({ products, lowStock, sales, employees, expenses }) => {
        this.totalProducts = products.length;
        this.lowStockCount = lowStock.length;
        this.lowStockProducts = lowStock;
        this.totalEmployees = employees.length;
        this.totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);

        const today = new Date().toDateString();
        const todaySales = sales.filter(s => {
          if (!s.createdAt) return false;
          return new Date(s.createdAt).toDateString() === today;
        });

        this.todaySalesCount = todaySales.length;
        this.totalRevenue = todaySales.reduce((sum, s) => sum + (s.total || 0), 0);

        this.recentSales = [...sales]
          .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
          .slice(0, 5);
      },
      error: (err) => console.error('Failed to load dashboard data:', err)
    });
  }
}
