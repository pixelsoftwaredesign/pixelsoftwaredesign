import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { Product, Category } from '../../models/models';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="inventory">
      <div class="page-header">
        <div>
          <h1>Inventory Management</h1>
          <p>Manage products, categories, and stock levels</p>
        </div>
        <button class="btn-primary" (click)="openProductModal()">
          <span>+</span> Add Product
        </button>
      </div>

      <div class="summary-grid">
        <div class="summary-card border-teal">
          <div class="summary-icon bg-teal"><span>&#x1F4E6;</span></div>
          <div class="summary-info">
            <span class="summary-label">Total Products</span>
            <span class="summary-value">{{ products.length }}</span>
          </div>
        </div>
        <div class="summary-card border-amber">
          <div class="summary-icon bg-amber"><span>&#x1F3F7;&#xFE0F;</span></div>
          <div class="summary-info">
            <span class="summary-label">Total Categories</span>
            <span class="summary-value">{{ categories.length }}</span>
          </div>
        </div>
        <div class="summary-card border-red">
          <div class="summary-icon bg-red"><span>&#x26A0;&#xFE0F;</span></div>
          <div class="summary-info">
            <span class="summary-label">Low Stock Items</span>
            <span class="summary-value">{{ lowStockProducts.length }}</span>
          </div>
        </div>
        <div class="summary-card border-green">
          <div class="summary-icon bg-green"><span>&#x1F4B0;</span></div>
          <div class="summary-info">
            <span class="summary-label">Total Stock Value</span>
            <span class="summary-value">{{ totalStockValue | number:'1.2-2' }} TND</span>
          </div>
        </div>
      </div>

      <div class="category-tabs">
        <button class="tab-btn" [class.active]="selectedCategoryId === null"
          (click)="filterByCategory(null)">All Products</button>
        <button *ngFor="let cat of categories" class="tab-btn"
          [class.active]="selectedCategoryId === cat.id"
          (click)="filterByCategory(cat.id!)">{{ cat.name }}</button>
      </div>

      <div class="panel">
        <div class="panel-header">
          <h2>Products</h2>
          <span class="panel-subtitle">{{ filteredProducts.length }} items</span>
        </div>
        <div class="table-wrapper" *ngIf="filteredProducts.length > 0; else noProducts">
          <table>
            <thead>
              <tr>
                <th>SKU</th>
                <th>Name</th>
                <th>Category</th>
                <th>Cost</th>
                <th>Selling</th>
                <th>Stock</th>
                <th>Unit</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let product of filteredProducts">
                <td><span class="sku-badge">{{ product.sku || '---' }}</span></td>
                <td class="name-cell">{{ product.name }}</td>
                <td>
                  <span class="category-badge" *ngIf="product.category">{{ product.category.name }}</span>
                  <span class="no-category" *ngIf="!product.category">---</span>
                </td>
                <td class="amount">{{ product.costPrice | number:'1.2-2' }} TND</td>
                <td class="amount">{{ product.sellingPrice | number:'1.2-2' }} TND</td>
                <td>
                  <div class="stock-cell">
                    <span class="stock-indicator" [class.low]="isLowStock(product)"></span>
                    <span [class.low-stock-text]="isLowStock(product)">{{ product.stockQuantity }}</span>
                  </div>
                </td>
                <td>{{ product.unit || '---' }}</td>
                <td>
                  <div class="actions">
                    <button class="btn-icon btn-edit" (click)="editProduct(product)" title="Edit">&#x270E;</button>
                    <button class="btn-icon btn-delete" (click)="deleteProduct(product)" title="Delete">&#x2715;</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <ng-template #noProducts>
          <div class="empty-state">
            <span class="empty-icon">&#x1F4E6;</span>
            <p>No products found</p>
          </div>
        </ng-template>
      </div>

      <div class="panel low-stock-panel" *ngIf="lowStockProducts.length > 0">
        <div class="panel-header">
          <h2>&#x26A0;&#xFE0F; Low Stock Alert</h2>
          <span class="panel-subtitle">{{ lowStockProducts.length }} items below minimum stock</span>
        </div>
        <div class="low-stock-grid">
          <div class="low-stock-card" *ngFor="let product of lowStockProducts">
            <div class="low-stock-header">
              <span class="low-stock-name">{{ product.name }}</span>
              <span class="low-stock-sku">{{ product.sku || 'No SKU' }}</span>
            </div>
            <div class="low-stock-nums">
              <div class="current-stock">
                <span class="stock-num critical">{{ product.stockQuantity }}</span>
                <span class="stock-label">Current</span>
              </div>
              <div class="min-stock-col">
                <span class="stock-num">{{ product.minStock || 0 }}</span>
                <span class="stock-label">Minimum</span>
              </div>
            </div>
            <button class="btn-restock" (click)="editProduct(product)">Restock</button>
          </div>
        </div>
      </div>

      <div class="panel category-panel">
        <div class="panel-header">
          <h2>Category Management</h2>
        </div>
        <div class="category-content">
          <div class="category-list">
            <div class="category-item" *ngFor="let cat of categories">
              <div class="cat-info">
                <span class="cat-name">{{ cat.name }}</span>
                <span class="cat-desc">{{ cat.description || 'No description' }}</span>
              </div>
              <div class="cat-actions">
                <button class="btn-sm btn-outline" (click)="editCategory(cat)">Edit</button>
                <button class="btn-sm btn-danger-outline" (click)="deleteCategory(cat)">Delete</button>
              </div>
            </div>
            <div class="empty-state" *ngIf="categories.length === 0">
              <p>No categories yet. Add one below.</p>
            </div>
          </div>
          <div class="category-form">
            <h3>{{ editingCategory ? 'Edit Category' : 'Add Category' }}</h3>
            <div class="field">
              <label>Name</label>
              <input type="text" [(ngModel)]="categoryForm.name" placeholder="Category name">
            </div>
            <div class="field">
              <label>Description</label>
              <input type="text" [(ngModel)]="categoryForm.description" placeholder="Optional description">
            </div>
            <div class="form-actions">
              <button class="btn-primary-sm" (click)="saveCategory()">{{ editingCategory ? 'Update' : 'Add' }}</button>
              <button class="btn-secondary-sm" *ngIf="editingCategory" (click)="cancelEditCategory()">Cancel</button>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-overlay" *ngIf="showProductModal" (click)="closeProductModal()">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>{{ editingProduct ? 'Edit Product' : 'Add New Product' }}</h2>
            <button class="modal-close" (click)="closeProductModal()">&#x2715;</button>
          </div>
          <div class="modal-body">
            <div class="form-grid">
              <div class="field">
                <label>Name *</label>
                <input type="text" [(ngModel)]="productForm.name" placeholder="Product name">
              </div>
              <div class="field">
                <label>SKU</label>
                <input type="text" [(ngModel)]="productForm.sku" placeholder="e.g. PRD-001">
              </div>
              <div class="field">
                <label>Category</label>
                <select [(ngModel)]="selectedProductCategoryId">
                  <option [ngValue]="null">-- Select Category --</option>
                  <option *ngFor="let cat of categories" [ngValue]="cat.id">{{ cat.name }}</option>
                </select>
              </div>
              <div class="field">
                <label>Unit</label>
                <input type="text" [(ngModel)]="productForm.unit" placeholder="e.g. pcs, kg, L">
              </div>
              <div class="field">
                <label>Cost Price (TND) *</label>
                <input type="number" [(ngModel)]="productForm.costPrice" placeholder="0.00" step="0.01">
              </div>
              <div class="field">
                <label>Selling Price (TND) *</label>
                <input type="number" [(ngModel)]="productForm.sellingPrice" placeholder="0.00" step="0.01">
              </div>
              <div class="field">
                <label>Stock Quantity *</label>
                <input type="number" [(ngModel)]="productForm.stockQuantity" placeholder="0">
              </div>
              <div class="field">
                <label>Minimum Stock</label>
                <input type="number" [(ngModel)]="productForm.minStock" placeholder="0">
              </div>
            </div>
            <div class="field full-width">
              <label>Description</label>
              <textarea [(ngModel)]="productForm.description" rows="3" placeholder="Product description..."></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-secondary" (click)="closeProductModal()">Cancel</button>
            <button class="btn-primary" (click)="saveProduct()">{{ editingProduct ? 'Update Product' : 'Add Product' }}</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .inventory { padding: 24px; max-width: 1400px; margin: 0 auto; }

    .page-header {
      display: flex; justify-content: space-between; align-items: flex-start;
      margin-bottom: 28px;
    }
    .page-header h1 { margin: 0 0 4px; font-size: 1.75rem; color: #134e4a; font-weight: 700; }
    .page-header p { margin: 0; color: #6b7280; font-size: 0.95rem; }
    .btn-primary {
      display: inline-flex; align-items: center; gap: 6px; padding: 10px 20px;
      background: #0d9488; color: white; border: none; border-radius: 8px;
      font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: background 0.15s;
    }
    .btn-primary:hover { background: #0f766e; }
    .btn-primary span { font-size: 1.2rem; line-height: 1; }

    .summary-grid {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 20px; margin-bottom: 24px;
    }
    .summary-card {
      background: white; border-radius: 12px; padding: 20px;
      display: flex; align-items: center; gap: 16px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08); border-left: 4px solid transparent;
      transition: transform 0.15s, box-shadow 0.15s;
    }
    .summary-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .border-teal { border-left-color: #0d9488; }
    .border-amber { border-left-color: #f59e0b; }
    .border-red { border-left-color: #ef4444; }
    .border-green { border-left-color: #22c55e; }
    .summary-icon {
      width: 48px; height: 48px; border-radius: 12px;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .summary-icon span { font-size: 1.3rem; }
    .bg-teal { background: #f0fdfa; }
    .bg-amber { background: #fffbeb; }
    .bg-red { background: #fef2f2; }
    .bg-green { background: #f0fdf4; }
    .summary-info { display: flex; flex-direction: column; }
    .summary-label { font-size: 0.8rem; color: #6b7280; font-weight: 500; text-transform: uppercase; letter-spacing: 0.3px; }
    .summary-value { font-size: 1.5rem; font-weight: 700; color: #134e4a; margin-top: 2px; }

    .category-tabs {
      display: flex; gap: 8px; margin-bottom: 24px; overflow-x: auto;
      padding-bottom: 4px;
    }
    .tab-btn {
      padding: 8px 18px; border: 1px solid #e5e7eb; background: white;
      border-radius: 20px; font-size: 0.85rem; cursor: pointer;
      color: #6b7280; white-space: nowrap; transition: all 0.15s;
    }
    .tab-btn:hover { border-color: #0d9488; color: #0d9488; }
    .tab-btn.active { background: #0d9488; color: white; border-color: #0d9488; }

    .panel {
      background: white; border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08); overflow: hidden; margin-bottom: 24px;
    }
    .panel-header {
      padding: 20px 24px; border-bottom: 1px solid #f3f4f6;
      display: flex; justify-content: space-between; align-items: baseline;
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
    .sku-badge {
      font-family: monospace; font-size: 0.8rem; padding: 2px 8px;
      background: #f3f4f6; border-radius: 4px; color: #6b7280;
    }
    .name-cell { font-weight: 600; color: #134e4a; }
    .category-badge {
      display: inline-block; padding: 3px 10px; border-radius: 20px;
      font-size: 0.75rem; font-weight: 500; background: #f0fdfa; color: #0d9488;
    }
    .no-category { color: #d1d5db; }
    .amount { font-weight: 500; }
    .stock-cell { display: flex; align-items: center; gap: 8px; }
    .stock-indicator {
      width: 8px; height: 8px; border-radius: 50%; background: #22c55e; display: inline-block;
    }
    .stock-indicator.low { background: #ef4444; animation: pulse 1.5s infinite; }
    .low-stock-text { color: #ef4444; font-weight: 600; }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

    .actions { display: flex; gap: 6px; }
    .btn-icon {
      width: 32px; height: 32px; border: none; border-radius: 6px;
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      font-size: 0.85rem; transition: all 0.15s;
    }
    .btn-edit { background: #f0fdfa; color: #0d9488; }
    .btn-edit:hover { background: #0d9488; color: white; }
    .btn-delete { background: #fef2f2; color: #dc2626; }
    .btn-delete:hover { background: #dc2626; color: white; }

    .low-stock-panel { border: 1px solid #fecaca; }
    .low-stock-grid {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 16px; padding: 20px;
    }
    .low-stock-card {
      background: #fef2f2; border-radius: 10px; padding: 16px;
      border: 1px solid #fecaca;
    }
    .low-stock-header { margin-bottom: 12px; }
    .low-stock-name { display: block; font-weight: 600; color: #374151; font-size: 0.95rem; }
    .low-stock-sku { font-size: 0.78rem; color: #9ca3af; }
    .low-stock-nums { display: flex; gap: 20px; margin-bottom: 12px; }
    .current-stock, .min-stock-col { display: flex; flex-direction: column; align-items: center; }
    .stock-num { font-size: 1.3rem; font-weight: 700; color: #374151; }
    .stock-num.critical { color: #dc2626; }
    .stock-label { font-size: 0.7rem; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; }
    .btn-restock {
      width: 100%; padding: 8px; background: white; border: 1px solid #d1d5db;
      border-radius: 6px; font-size: 0.8rem; font-weight: 500; color: #374151;
      cursor: pointer; transition: all 0.15s;
    }
    .btn-restock:hover { border-color: #0d9488; color: #0d9488; }

    .category-content {
      display: grid; grid-template-columns: 1fr 1fr; gap: 0;
    }
    .category-list { border-right: 1px solid #f3f4f6; padding: 8px 0; max-height: 400px; overflow-y: auto; }
    .category-item {
      display: flex; justify-content: space-between; align-items: center;
      padding: 14px 24px; border-bottom: 1px solid #f3f4f6;
      transition: background 0.15s;
    }
    .category-item:hover { background: #f9fafb; }
    .cat-info { display: flex; flex-direction: column; gap: 2px; }
    .cat-name { font-weight: 600; color: #374151; font-size: 0.9rem; }
    .cat-desc { font-size: 0.78rem; color: #9ca3af; }
    .cat-actions { display: flex; gap: 6px; }
    .btn-sm {
      padding: 4px 12px; border-radius: 6px; font-size: 0.78rem;
      font-weight: 500; cursor: pointer; transition: all 0.15s;
    }
    .btn-outline { background: white; border: 1px solid #d1d5db; color: #374151; }
    .btn-outline:hover { border-color: #0d9488; color: #0d9488; }
    .btn-danger-outline { background: white; border: 1px solid #fecaca; color: #dc2626; }
    .btn-danger-outline:hover { background: #dc2626; color: white; border-color: #dc2626; }

    .category-form { padding: 20px 24px; }
    .category-form h3 { margin: 0 0 16px; font-size: 1rem; color: #134e4a; }

    .field { margin-bottom: 16px; }
    .field label {
      display: block; margin-bottom: 6px; font-size: 0.82rem;
      font-weight: 500; color: #374151;
    }
    .field input, .field select, .field textarea {
      width: 100%; padding: 10px 14px; border: 1px solid #d1d5db;
      border-radius: 8px; font-size: 0.9rem; outline: none;
      box-sizing: border-box; font-family: inherit;
    }
    .field input:focus, .field select:focus, .field textarea:focus {
      border-color: #0d9488; box-shadow: 0 0 0 3px rgba(13,148,136,0.1);
    }
    .field textarea { resize: vertical; }
    .full-width { grid-column: 1 / -1; }
    .form-actions { display: flex; gap: 8px; margin-top: 8px; }
    .btn-primary-sm {
      padding: 8px 18px; background: #0d9488; color: white;
      border: none; border-radius: 6px; font-size: 0.85rem;
      font-weight: 600; cursor: pointer; transition: background 0.15s;
    }
    .btn-primary-sm:hover { background: #0f766e; }
    .btn-secondary-sm {
      padding: 8px 18px; background: white; color: #6b7280;
      border: 1px solid #d1d5db; border-radius: 6px; font-size: 0.85rem;
      cursor: pointer; transition: all 0.15s;
    }
    .btn-secondary-sm:hover { border-color: #6b7280; color: #374151; }

    .modal-overlay {
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.5); display: flex; align-items: center;
      justify-content: center; z-index: 1000; backdrop-filter: blur(2px);
    }
    .modal {
      background: white; border-radius: 16px; width: 90%; max-width: 640px;
      max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }
    .modal-header {
      display: flex; justify-content: space-between; align-items: center;
      padding: 24px 28px; border-bottom: 1px solid #f3f4f6;
    }
    .modal-header h2 { margin: 0; font-size: 1.2rem; color: #134e4a; }
    .modal-close {
      width: 32px; height: 32px; border: none; background: #f3f4f6;
      border-radius: 8px; cursor: pointer; font-size: 1rem; color: #6b7280;
      display: flex; align-items: center; justify-content: center; transition: all 0.15s;
    }
    .modal-close:hover { background: #e5e7eb; color: #374151; }
    .modal-body { padding: 24px 28px; }
    .form-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
    }
    .modal-footer {
      display: flex; justify-content: flex-end; gap: 10px;
      padding: 16px 28px; border-top: 1px solid #f3f4f6;
    }
    .btn-secondary {
      padding: 10px 20px; background: white; color: #6b7280;
      border: 1px solid #d1d5db; border-radius: 8px; font-size: 0.9rem;
      cursor: pointer; transition: all 0.15s;
    }
    .btn-secondary:hover { border-color: #6b7280; color: #374151; }

    .empty-state { padding: 48px 24px; text-align: center; color: #9ca3af; }
    .empty-icon { font-size: 2rem; display: block; margin-bottom: 8px; }
    .empty-state p { margin: 0; font-size: 0.9rem; }

    @media (max-width: 768px) {
      .category-content { grid-template-columns: 1fr; }
      .category-list { border-right: none; border-bottom: 1px solid #f3f4f6; max-height: 200px; }
      .form-grid { grid-template-columns: 1fr; }
      .page-header { flex-direction: column; gap: 16px; }
    }
  `]
})
export class InventoryComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  filteredProducts: Product[] = [];
  lowStockProducts: Product[] = [];
  totalStockValue = 0;
  selectedCategoryId: number | null = null;

  showProductModal = false;
  editingProduct: Product | null = null;
  editingCategory: Category | null = null;

  productForm: Partial<Product> = this.getEmptyProduct();
  categoryForm: Partial<Category> = { name: '', description: '' };
  selectedProductCategoryId: number | null = null;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    forkJoin({
      products: this.productService.getAll(),
      categories: this.categoryService.getAll()
    }).subscribe({
      next: ({ products, categories }) => {
        this.products = products;
        this.categories = categories;
        this.applyFilter();
        this.loadLowStock();
      },
      error: (err) => console.error('Failed to load inventory data:', err)
    });
  }

  private loadLowStock(): void {
    this.productService.getLowStock().subscribe({
      next: (items) => this.lowStockProducts = items,
      error: () => this.lowStockProducts = this.products.filter(p => this.isLowStock(p))
    });
  }

  private applyFilter(): void {
    if (this.selectedCategoryId === null) {
      this.filteredProducts = [...this.products];
    } else {
      this.filteredProducts = this.products.filter(p => p.category?.id === this.selectedCategoryId);
    }
    this.totalStockValue = this.products.reduce((sum, p) => sum + (p.costPrice * p.stockQuantity), 0);
  }

  filterByCategory(categoryId: number | null): void {
    this.selectedCategoryId = categoryId;
    this.applyFilter();
  }

  isLowStock(product: Product): boolean {
    return product.stockQuantity < (product.minStock || 0);
  }

  openProductModal(): void {
    this.editingProduct = null;
    this.productForm = this.getEmptyProduct();
    this.selectedProductCategoryId = null;
    this.showProductModal = true;
  }

  editProduct(product: Product): void {
    this.editingProduct = product;
    this.productForm = { ...product };
    this.selectedProductCategoryId = product.category?.id || null;
    this.showProductModal = true;
  }

  closeProductModal(): void {
    this.showProductModal = false;
    this.editingProduct = null;
    this.productForm = this.getEmptyProduct();
    this.selectedProductCategoryId = null;
  }

  saveProduct(): void {
    if (!this.productForm.name || !this.productForm.costPrice || !this.productForm.sellingPrice) return;

    const selectedCategory = this.categories.find(c => c.id === this.selectedProductCategoryId) || undefined;
    const payload: Product = {
      ...this.productForm as Product,
      category: selectedCategory
    };

    if (this.editingProduct?.id) {
      this.productService.update(this.editingProduct.id, payload).subscribe({
        next: () => { this.loadData(); this.closeProductModal(); },
        error: (err) => console.error('Failed to update product:', err)
      });
    } else {
      this.productService.create(payload).subscribe({
        next: () => { this.loadData(); this.closeProductModal(); },
        error: (err) => console.error('Failed to create product:', err)
      });
    }
  }

  deleteProduct(product: Product): void {
    if (!product.id) return;
    if (confirm(`Delete "${product.name}"? This cannot be undone.`)) {
      this.productService.delete(product.id).subscribe({
        next: () => this.loadData(),
        error: (err) => console.error('Failed to delete product:', err)
      });
    }
  }

  editCategory(category: Category): void {
    this.editingCategory = category;
    this.categoryForm = { name: category.name, description: category.description };
  }

  saveCategory(): void {
    if (!this.categoryForm.name) return;

    if (this.editingCategory?.id) {
      this.categoryService.update(this.editingCategory.id, this.categoryForm as Category).subscribe({
        next: () => { this.loadData(); this.cancelEditCategory(); },
        error: (err) => console.error('Failed to update category:', err)
      });
    } else {
      this.categoryService.create(this.categoryForm as Category).subscribe({
        next: () => { this.loadData(); this.categoryForm = { name: '', description: '' }; },
        error: (err) => console.error('Failed to create category:', err)
      });
    }
  }

  deleteCategory(category: Category): void {
    if (!category.id) return;
    if (confirm(`Delete category "${category.name}"?`)) {
      this.categoryService.delete(category.id).subscribe({
        next: () => this.loadData(),
        error: (err) => console.error('Failed to delete category:', err)
      });
    }
  }

  cancelEditCategory(): void {
    this.editingCategory = null;
    this.categoryForm = { name: '', description: '' };
  }

  private getEmptyProduct(): Partial<Product> {
    return { name: '', sku: '', description: '', costPrice: 0, sellingPrice: 0, stockQuantity: 0, minStock: 0, unit: 'pcs' };
  }
}
