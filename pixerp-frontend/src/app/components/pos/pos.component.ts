import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { SaleService } from '../../services/sale.service';
import { Product } from '../../models/models';

interface CartItem {
  product: Product;
  quantity: number;
}

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="pos-container">
      <div class="pos-header">
        <h1>Point of Sale</h1>
        <div class="pos-header-info">
          <span class="current-time">{{ currentTime }}</span>
        </div>
      </div>

      <div class="pos-body">
        <div class="products-panel">
          <div class="panel-header">
            <h2>Products</h2>
            <div class="search-box">
              <input type="text" [(ngModel)]="searchTerm" placeholder="Search products..." (ngModelChange)="filterProducts()">
              <span class="search-icon">🔍</span>
            </div>
          </div>
          <div class="products-grid">
            <div class="product-card" *ngFor="let product of filteredProducts" (click)="addToCart(product)"
                 [class.out-of-stock]="product.stockQuantity <= 0">
              <div class="product-name">{{ product.name }}</div>
              <div class="product-sku" *ngIf="product.sku">{{ product.sku }}</div>
              <div class="product-price">{{ product.sellingPrice | number:'1.2-3' }} TND</div>
              <div class="product-stock" [class.low]="product.stockQuantity <= (product.minStock || 0)">
                Stock: {{ product.stockQuantity }} {{ product.unit || 'units' }}
              </div>
            </div>
            <div class="empty-state" *ngIf="filteredProducts.length === 0">
              <span class="empty-icon">📦</span>
              <p>No products found</p>
            </div>
          </div>
        </div>

        <div class="cart-panel">
          <div class="panel-header">
            <h2>Current Order</h2>
            <button class="btn-clear" *ngIf="cart.length > 0" (click)="clearCart()">Clear All</button>
          </div>

          <div class="customer-field">
            <label>Customer Name (Optional)</label>
            <input type="text" [(ngModel)]="customerName" placeholder="Walk-in customer">
          </div>

          <div class="cart-items">
            <div class="cart-item" *ngFor="let item of cart; let i = index">
              <div class="item-info">
                <div class="item-name">{{ item.product.name }}</div>
                <div class="item-unit-price">{{ item.product.sellingPrice | number:'1.2-3' }} TND</div>
              </div>
              <div class="item-controls">
                <button class="qty-btn" (click)="decreaseQty(i)">−</button>
                <span class="qty-value">{{ item.quantity }}</span>
                <button class="qty-btn" (click)="increaseQty(i)">+</button>
              </div>
              <div class="item-total">
                {{ item.product.sellingPrice * item.quantity | number:'1.2-3' }} TND
              </div>
              <button class="btn-remove" (click)="removeFromCart(i)">✕</button>
            </div>
            <div class="empty-cart" *ngIf="cart.length === 0">
              <span class="empty-icon">🛒</span>
              <p>Cart is empty</p>
              <p class="empty-hint">Click products to add them</p>
            </div>
          </div>

          <div class="cart-summary" *ngIf="cart.length > 0">
            <div class="summary-row">
              <span>Subtotal</span>
              <span>{{ subtotal | number:'1.2-3' }} TND</span>
            </div>
            <div class="summary-row">
              <span>TVA (19%)</span>
              <span>{{ tax | number:'1.2-3' }} TND</span>
            </div>
            <div class="summary-row total">
              <span>Total</span>
              <span>{{ total | number:'1.2-3' }} TND</span>
            </div>
          </div>

          <div class="payment-section" *ngIf="cart.length > 0">
            <label>Payment Method</label>
            <div class="payment-methods">
              <button *ngFor="let method of paymentMethods" class="payment-btn"
                      [class.active]="selectedPaymentMethod === method.value"
                      (click)="selectedPaymentMethod = method.value">
                <span class="payment-icon">{{ method.icon }}</span>
                <span>{{ method.label }}</span>
              </button>
            </div>
          </div>

          <button class="btn-complete" *ngIf="cart.length > 0" (click)="completeSale()" [disabled]="processing">
            {{ processing ? 'Processing...' : 'Complete Sale - ' + (total | number:'1.2-3') + ' TND' }}
          </button>
        </div>
      </div>

      <div class="toast-success" *ngIf="successMessage">
        <span class="toast-icon">✓</span>
        {{ successMessage }}
      </div>

      <div class="toast-warning" *ngIf="warningMessage">
        <span class="toast-icon">⚠</span>
        {{ warningMessage }}
      </div>
    </div>
  `,
  styles: [`
    .pos-container {
      min-height: 100vh;
      background: #f0fdfa;
      display: flex;
      flex-direction: column;
    }

    .pos-header {
      background: linear-gradient(135deg, #134e4a 0%, #0d9488 100%);
      color: white;
      padding: 16px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    }

    .pos-header h1 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 700;
    }

    .pos-header-info {
      font-size: 0.9rem;
      opacity: 0.9;
    }

    .pos-body {
      display: flex;
      flex: 1;
      gap: 0;
      overflow: hidden;
    }

    .products-panel {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 20px;
      overflow: hidden;
    }

    .cart-panel {
      width: 400px;
      background: white;
      display: flex;
      flex-direction: column;
      border-left: 1px solid #e5e7eb;
      overflow: hidden;
    }

    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .panel-header h2 {
      margin: 0;
      font-size: 1.1rem;
      color: #134e4a;
      font-weight: 600;
    }

    .search-box {
      position: relative;
      width: 250px;
    }

    .search-box input {
      width: 100%;
      padding: 10px 14px 10px 36px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 0.9rem;
      outline: none;
      background: white;
    }

    .search-box input:focus {
      border-color: #0d9488;
      box-shadow: 0 0 0 3px rgba(13,148,136,0.1);
    }

    .search-icon {
      position: absolute;
      left: 10px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 0.85rem;
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 12px;
      overflow-y: auto;
      flex: 1;
      padding-right: 4px;
    }

    .product-card {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 10px;
      padding: 14px;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .product-card:hover {
      border-color: #0d9488;
      box-shadow: 0 4px 12px rgba(13,148,136,0.15);
      transform: translateY(-2px);
    }

    .product-card.out-of-stock {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .product-name {
      font-weight: 600;
      font-size: 0.9rem;
      color: #1f2937;
    }

    .product-sku {
      font-size: 0.75rem;
      color: #9ca3af;
    }

    .product-price {
      font-size: 1.05rem;
      font-weight: 700;
      color: #0d9488;
    }

    .product-stock {
      font-size: 0.75rem;
      color: #6b7280;
    }

    .product-stock.low {
      color: #dc2626;
      font-weight: 500;
    }

    .empty-state {
      grid-column: 1 / -1;
      text-align: center;
      padding: 40px;
      color: #9ca3af;
    }

    .empty-icon {
      font-size: 2rem;
      display: block;
      margin-bottom: 8px;
    }

    .btn-clear {
      padding: 6px 12px;
      background: #fee2e2;
      color: #dc2626;
      border: none;
      border-radius: 6px;
      font-size: 0.8rem;
      cursor: pointer;
      font-weight: 500;
    }

    .btn-clear:hover {
      background: #fecaca;
    }

    .customer-field {
      margin-bottom: 12px;
      padding: 0 16px;
    }

    .customer-field label {
      display: block;
      font-size: 0.8rem;
      font-weight: 500;
      color: #6b7280;
      margin-bottom: 4px;
    }

    .customer-field input {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 0.85rem;
      outline: none;
      box-sizing: border-box;
    }

    .customer-field input:focus {
      border-color: #0d9488;
      box-shadow: 0 0 0 3px rgba(13,148,136,0.1);
    }

    .cart-items {
      flex: 1;
      overflow-y: auto;
      padding: 0 16px;
    }

    .cart-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 0;
      border-bottom: 1px solid #f3f4f6;
    }

    .item-info {
      flex: 1;
      min-width: 0;
    }

    .item-name {
      font-weight: 500;
      font-size: 0.85rem;
      color: #1f2937;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .item-unit-price {
      font-size: 0.75rem;
      color: #9ca3af;
    }

    .item-controls {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .qty-btn {
      width: 26px;
      height: 26px;
      border: 1px solid #d1d5db;
      background: white;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.85rem;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #374151;
      transition: all 0.15s;
    }

    .qty-btn:hover {
      background: #f0fdfa;
      border-color: #0d9488;
      color: #0d9488;
    }

    .qty-value {
      width: 28px;
      text-align: center;
      font-weight: 600;
      font-size: 0.85rem;
    }

    .item-total {
      font-weight: 600;
      font-size: 0.85rem;
      color: #0d9488;
      min-width: 70px;
      text-align: right;
    }

    .btn-remove {
      background: none;
      border: none;
      color: #dc2626;
      cursor: pointer;
      font-size: 0.8rem;
      padding: 4px;
      border-radius: 4px;
      transition: background 0.15s;
    }

    .btn-remove:hover {
      background: #fee2e2;
    }

    .empty-cart {
      text-align: center;
      padding: 40px 16px;
      color: #9ca3af;
    }

    .empty-hint {
      font-size: 0.8rem;
      margin-top: 4px;
    }

    .cart-summary {
      padding: 16px;
      border-top: 2px solid #e5e7eb;
      background: #f9fafb;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 6px;
      font-size: 0.9rem;
      color: #6b7280;
    }

    .summary-row.total {
      margin-top: 8px;
      padding-top: 8px;
      border-top: 1px solid #e5e7eb;
      font-size: 1.1rem;
      font-weight: 700;
      color: #134e4a;
    }

    .payment-section {
      padding: 16px;
    }

    .payment-section label {
      display: block;
      font-size: 0.8rem;
      font-weight: 500;
      color: #6b7280;
      margin-bottom: 8px;
    }

    .payment-methods {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }

    .payment-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 10px;
      border: 2px solid #e5e7eb;
      background: white;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.8rem;
      font-weight: 500;
      color: #6b7280;
      transition: all 0.15s;
    }

    .payment-btn:hover {
      border-color: #0d9488;
    }

    .payment-btn.active {
      border-color: #0d9488;
      background: #f0fdfa;
      color: #0d9488;
    }

    .payment-icon {
      font-size: 1rem;
    }

    .btn-complete {
      margin: 0 16px 16px;
      padding: 14px;
      background: linear-gradient(135deg, #0d9488, #0f766e);
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 1rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-complete:hover {
      background: linear-gradient(135deg, #0f766e, #134e4a);
      box-shadow: 0 4px 12px rgba(13,148,136,0.3);
    }

    .btn-complete:disabled {
      background: #9ca3af;
      cursor: not-allowed;
      box-shadow: none;
    }

    .toast-success, .toast-warning {
      position: fixed;
      top: 80px;
      right: 24px;
      padding: 14px 20px;
      border-radius: 10px;
      font-size: 0.9rem;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 8px;
      z-index: 1000;
      animation: slideIn 0.3s ease-out;
      box-shadow: 0 4px 16px rgba(0,0,0,0.15);
    }

    .toast-success {
      background: #065f46;
      color: white;
    }

    .toast-warning {
      background: #92400e;
      color: white;
    }

    .toast-icon {
      font-size: 1.1rem;
      font-weight: 700;
    }

    @keyframes slideIn {
      from { transform: translateX(100px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `]
})
export class PosComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  cart: CartItem[] = [];
  searchTerm = '';
  customerName = '';
  selectedPaymentMethod = 'CASH';
  processing = false;
  successMessage = '';
  warningMessage = '';
  currentTime = '';

  paymentMethods = [
    { value: 'CASH', label: 'Cash', icon: '💵' },
    { value: 'CARD', label: 'Card', icon: '💳' },
    { value: 'MOBILE', label: 'Mobile', icon: '📱' },
    { value: 'TRANSFER', label: 'Transfer', icon: '🏦' }
  ];

  constructor(
    private productService: ProductService,
    private saleService: SaleService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.updateTime();
    setInterval(() => this.updateTime(), 1000);
  }

  updateTime(): void {
    this.currentTime = new Date().toLocaleString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
  }

  loadProducts(): void {
    this.productService.getAll().subscribe({
      next: (data) => { this.products = data; this.filterProducts(); },
      error: (err) => console.error('Failed to load products', err)
    });
  }

  filterProducts(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredProducts = this.products.filter(p =>
      p.active !== false && p.name.toLowerCase().includes(term)
    );
  }

  addToCart(product: Product): void {
    if (product.stockQuantity <= 0) {
      this.showWarning(`${product.name} is out of stock`);
      return;
    }
    const existing = this.cart.find(c => c.product.id === product.id);
    if (existing) {
      if (existing.quantity >= product.stockQuantity) {
        this.showWarning(`Only ${product.stockQuantity} in stock for ${product.name}`);
        return;
      }
      existing.quantity++;
    } else {
      this.cart.push({ product, quantity: 1 });
    }
  }

  increaseQty(index: number): void {
    const item = this.cart[index];
    if (item.quantity < item.product.stockQuantity) {
      item.quantity++;
    } else {
      this.showWarning(`Only ${item.product.stockQuantity} in stock`);
    }
  }

  decreaseQty(index: number): void {
    if (this.cart[index].quantity > 1) {
      this.cart[index].quantity--;
    } else {
      this.cart.splice(index, 1);
    }
  }

  removeFromCart(index: number): void {
    this.cart.splice(index, 1);
  }

  clearCart(): void {
    this.cart = [];
    this.customerName = '';
  }

  get subtotal(): number {
    return this.cart.reduce((sum, item) => sum + item.product.sellingPrice * item.quantity, 0);
  }

  get tax(): number {
    return this.subtotal * 0.19;
  }

  get total(): number {
    return this.subtotal + this.tax;
  }

  completeSale(): void {
    if (this.cart.length === 0) return;
    this.processing = true;

    const salePayload = {
      sale: {
        paymentMethod: this.selectedPaymentMethod,
        customerName: this.customerName || null
      },
      items: this.cart.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        unitPrice: item.product.sellingPrice
      }))
    };

    this.saleService.create(salePayload).subscribe({
      next: () => {
        this.successMessage = `Sale completed successfully! Total: ${this.total.toFixed(3)} TND`;
        this.clearCart();
        this.loadProducts();
        this.processing = false;
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        const msg = err.error?.error || 'Sale failed. Please try again.';
        this.showWarning(msg);
        this.processing = false;
      }
    });
  }

  showWarning(msg: string): void {
    this.warningMessage = msg;
    setTimeout(() => this.warningMessage = '', 3000);
  }
}
