import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { JournalEntryService } from '../../services/journal-entry.service';
import { ExpenseService } from '../../services/expense.service';
import { Account, JournalEntry, Expense } from '../../models/models';

@Component({
  selector: 'app-accounting',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="accounting-page">
      <div class="page-header">
        <h2>Accounting</h2>
        <p>Manage chart of accounts, journal entries, and expenses</p>
      </div>

      <div class="tabs">
        <button [class.active]="activeTab === 'accounts'" (click)="activeTab = 'accounts'">Chart of Accounts</button>
        <button [class.active]="activeTab === 'journal'" (click)="activeTab = 'journal'">Journal Entries</button>
        <button [class.active]="activeTab === 'expenses'" (click)="activeTab = 'expenses'">Expenses</button>
      </div>

      <!-- ========== CHART OF ACCOUNTS TAB ========== -->
      <div *ngIf="activeTab === 'accounts'" class="tab-content">
        <div class="section-header">
          <h3>Chart of Accounts</h3>
          <button class="btn-primary" (click)="showAccountForm = !showAccountForm">
            {{ showAccountForm ? 'Cancel' : '+ Add Account' }}
          </button>
        </div>

        <div class="type-filters">
          <button [class.active]="accountTypeFilter === ''" (click)="filterAccountsByType('')">All</button>
          <button [class.active]="accountTypeFilter === 'ASSET'" (click)="filterAccountsByType('ASSET')">Asset</button>
          <button [class.active]="accountTypeFilter === 'LIABILITY'" (click)="filterAccountsByType('LIABILITY')">Liability</button>
          <button [class.active]="accountTypeFilter === 'EQUITY'" (click)="filterAccountsByType('EQUITY')">Equity</button>
          <button [class.active]="accountTypeFilter === 'REVENUE'" (click)="filterAccountsByType('REVENUE')">Revenue</button>
          <button [class.active]="accountTypeFilter === 'EXPENSE'" (click)="filterAccountsByType('EXPENSE')">Expense</button>
        </div>

        <div *ngIf="showAccountForm" class="form-card">
          <h4>{{ editingAccountId ? 'Edit Account' : 'Add Account' }}</h4>
          <div class="form-grid">
            <div class="field">
              <label>Code</label>
              <input type="text" [(ngModel)]="accountForm.code" placeholder="e.g. 1000">
            </div>
            <div class="field">
              <label>Name</label>
              <input type="text" [(ngModel)]="accountForm.name" placeholder="Account name">
            </div>
            <div class="field">
              <label>Type</label>
              <select [(ngModel)]="accountForm.type">
                <option value="ASSET">Asset</option>
                <option value="LIABILITY">Liability</option>
                <option value="EQUITY">Equity</option>
                <option value="REVENUE">Revenue</option>
                <option value="EXPENSE">Expense</option>
              </select>
            </div>
            <div class="field">
              <label>Description</label>
              <input type="text" [(ngModel)]="accountForm.description" placeholder="Description">
            </div>
          </div>
          <div class="form-actions">
            <button class="btn-cancel" (click)="cancelAccountForm()">Cancel</button>
            <button class="btn-primary" (click)="saveAccount()">{{ editingAccountId ? 'Update' : 'Save' }}</button>
          </div>
        </div>

        <div class="table-card">
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let account of filteredAccounts">
                <td class="code-cell">{{ account.code }}</td>
                <td>{{ account.name }}</td>
                <td>
                  <span class="badge" [ngClass]="'badge-' + account.type.toLowerCase()">{{ account.type }}</span>
                </td>
                <td>
                  <span class="status-dot" [class.active]="account.active !== false"></span>
                  {{ account.active !== false ? 'Active' : 'Inactive' }}
                </td>
                <td class="actions-cell">
                  <button class="btn-icon" (click)="editAccount(account)" title="Edit">&#9998;</button>
                  <button class="btn-icon btn-danger" (click)="deleteAccount(account.id!)" title="Delete">&#10005;</button>
                </td>
              </tr>
              <tr *ngIf="filteredAccounts.length === 0">
                <td colspan="5" class="empty-row">No accounts found</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ========== JOURNAL ENTRIES TAB ========== -->
      <div *ngIf="activeTab === 'journal'" class="tab-content">
        <div class="section-header">
          <h3>Journal Entries</h3>
          <button class="btn-primary" (click)="showEntryForm = !showEntryForm">
            {{ showEntryForm ? 'Cancel' : '+ New Entry' }}
          </button>
        </div>

        <div class="filter-bar">
          <div class="field-inline">
            <label>From</label>
            <input type="date" [(ngModel)]="dateFilterStart">
          </div>
          <div class="field-inline">
            <label>To</label>
            <input type="date" [(ngModel)]="dateFilterEnd">
          </div>
          <button class="btn-filter" (click)="filterEntriesByDate()">Filter</button>
          <button class="btn-clear" (click)="clearDateFilter()">Clear</button>
        </div>

        <div *ngIf="showEntryForm" class="form-card">
          <h4>{{ editingEntryId ? 'Edit Entry' : 'New Journal Entry' }}</h4>
          <div class="form-grid">
            <div class="field">
              <label>Date</label>
              <input type="date" [(ngModel)]="entryForm.date">
            </div>
            <div class="field">
              <label>Description</label>
              <input type="text" [(ngModel)]="entryForm.description" placeholder="Entry description">
            </div>
            <div class="field">
              <label>Debit Account</label>
              <select [(ngModel)]="entryDebitAccountId">
                <option value="">Select account</option>
                <option *ngFor="let a of accounts" [value]="a.id">{{ a.code }} - {{ a.name }}</option>
              </select>
            </div>
            <div class="field">
              <label>Credit Account</label>
              <select [(ngModel)]="entryCreditAccountId">
                <option value="">Select account</option>
                <option *ngFor="let a of accounts" [value]="a.id">{{ a.code }} - {{ a.name }}</option>
              </select>
            </div>
            <div class="field">
              <label>Amount (TND)</label>
              <input type="number" [(ngModel)]="entryForm.amount" placeholder="0.00" min="0" step="0.01">
            </div>
            <div class="field">
              <label>Status</label>
              <select [(ngModel)]="entryForm.status">
                <option value="DRAFT">Draft</option>
                <option value="POSTED">Posted</option>
                <option value="REVERSED">Reversed</option>
              </select>
            </div>
          </div>
          <div class="form-actions">
            <button class="btn-cancel" (click)="cancelEntryForm()">Cancel</button>
            <button class="btn-primary" (click)="saveEntry()">{{ editingEntryId ? 'Update' : 'Save' }}</button>
          </div>
        </div>

        <div class="table-card">
          <table>
            <thead>
              <tr>
                <th>Entry #</th>
                <th>Date</th>
                <th>Description</th>
                <th>Debit Account</th>
                <th>Credit Account</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let entry of journalEntries">
                <td class="code-cell">{{ entry.entryNumber || '-' }}</td>
                <td>{{ entry.date }}</td>
                <td>{{ entry.description }}</td>
                <td>{{ entry.debitAccount?.code }} - {{ entry.debitAccount?.name }}</td>
                <td>{{ entry.creditAccount?.code }} - {{ entry.creditAccount?.name }}</td>
                <td class="amount-cell">{{ entry.amount | number:'1.2-2' }} TND</td>
                <td>
                  <span class="badge" [ngClass]="'badge-' + (entry.status || 'DRAFT').toLowerCase()">{{ entry.status || 'DRAFT' }}</span>
                </td>
                <td class="actions-cell">
                  <button class="btn-icon" (click)="editEntry(entry)" title="Edit">&#9998;</button>
                  <button class="btn-icon btn-danger" (click)="deleteEntry(entry.id!)" title="Delete">&#10005;</button>
                </td>
              </tr>
              <tr *ngIf="journalEntries.length === 0">
                <td colspan="8" class="empty-row">No journal entries found</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ========== EXPENSES TAB ========== -->
      <div *ngIf="activeTab === 'expenses'" class="tab-content">
        <div class="section-header">
          <h3>Expenses</h3>
          <button class="btn-primary" (click)="showExpenseForm = !showExpenseForm">
            {{ showExpenseForm ? 'Cancel' : '+ Add Expense' }}
          </button>
        </div>

        <div class="summary-cards">
          <div class="summary-card">
            <div class="summary-icon total-icon">TND</div>
            <div class="summary-info">
              <span class="summary-value">{{ totalExpenses | number:'1.2-2' }} TND</span>
              <span class="summary-label">Total Expenses</span>
            </div>
          </div>
          <div class="summary-card">
            <div class="summary-icon approved-icon">&#10003;</div>
            <div class="summary-info">
              <span class="summary-value">{{ approvedExpenses | number:'1.2-2' }} TND</span>
              <span class="summary-label">Approved</span>
            </div>
          </div>
          <div class="summary-card">
            <div class="summary-icon pending-icon">!</div>
            <div class="summary-info">
              <span class="summary-value">{{ pendingExpenses | number:'1.2-2' }} TND</span>
              <span class="summary-label">Pending</span>
            </div>
          </div>
          <div class="summary-card">
            <div class="summary-icon month-icon">&#9679;</div>
            <div class="summary-info">
              <span class="summary-value">{{ thisMonthExpenses | number:'1.2-2' }} TND</span>
              <span class="summary-label">This Month</span>
            </div>
          </div>
        </div>

        <div class="filter-bar">
          <div class="field-inline">
            <label>Category</label>
            <select [(ngModel)]="expenseCategoryFilter" (change)="filterExpenses()">
              <option value="">All Categories</option>
              <option value="RENT">Rent</option>
              <option value="UTILITIES">Utilities</option>
              <option value="SALARIES">Salaries</option>
              <option value="SUPPLIES">Supplies</option>
              <option value="MARKETING">Marketing</option>
              <option value="TRAVEL">Travel</option>
              <option value="MAINTENANCE">Maintenance</option>
              <option value="INSURANCE">Insurance</option>
              <option value="TAXES">Taxes</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
        </div>

        <div *ngIf="showExpenseForm" class="form-card">
          <h4>{{ editingExpenseId ? 'Edit Expense' : 'Add Expense' }}</h4>
          <div class="form-grid">
            <div class="field">
              <label>Description</label>
              <input type="text" [(ngModel)]="expenseForm.description" placeholder="Expense description">
            </div>
            <div class="field">
              <label>Amount (TND)</label>
              <input type="number" [(ngModel)]="expenseForm.amount" placeholder="0.00" min="0" step="0.01">
            </div>
            <div class="field">
              <label>Category</label>
              <select [(ngModel)]="expenseForm.category">
                <option value="RENT">Rent</option>
                <option value="UTILITIES">Utilities</option>
                <option value="SALARIES">Salaries</option>
                <option value="SUPPLIES">Supplies</option>
                <option value="MARKETING">Marketing</option>
                <option value="TRAVEL">Travel</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="INSURANCE">Insurance</option>
                <option value="TAXES">Taxes</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div class="field">
              <label>Date</label>
              <input type="date" [(ngModel)]="expenseForm.date">
            </div>
            <div class="field">
              <label>Payment Method</label>
              <select [(ngModel)]="expenseForm.paymentMethod">
                <option value="CASH">Cash</option>
                <option value="CARD">Card</option>
                <option value="TRANSFER">Transfer</option>
                <option value="CHECK">Check</option>
              </select>
            </div>
            <div class="field">
              <label>Status</label>
              <select [(ngModel)]="expenseForm.status">
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
            <div class="field field-full">
              <label>Notes</label>
              <input type="text" [(ngModel)]="expenseForm.notes" placeholder="Additional notes">
            </div>
          </div>
          <div class="form-actions">
            <button class="btn-cancel" (click)="cancelExpenseForm()">Cancel</button>
            <button class="btn-primary" (click)="saveExpense()">{{ editingExpenseId ? 'Update' : 'Save' }}</button>
          </div>
        </div>

        <div class="table-card">
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Date</th>
                <th>Payment Method</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let expense of filteredExpenses">
                <td>{{ expense.description }}</td>
                <td class="amount-cell">{{ expense.amount | number:'1.2-2' }} TND</td>
                <td>
                  <span class="badge badge-category">{{ expense.category }}</span>
                </td>
                <td>{{ expense.date }}</td>
                <td>{{ expense.paymentMethod }}</td>
                <td>
                  <span class="badge" [ngClass]="'badge-' + (expense.status || 'PENDING').toLowerCase()">{{ expense.status || 'PENDING' }}</span>
                </td>
                <td class="actions-cell">
                  <button class="btn-icon" (click)="editExpense(expense)" title="Edit">&#9998;</button>
                  <button class="btn-icon btn-danger" (click)="deleteExpense(expense.id!)" title="Delete">&#10005;</button>
                </td>
              </tr>
              <tr *ngIf="filteredExpenses.length === 0">
                <td colspan="7" class="empty-row">No expenses found</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .accounting-page { padding: 24px; }
    .page-header { margin-bottom: 24px; }
    .page-header h2 { margin: 0; color: #134e4a; font-size: 1.5rem; }
    .page-header p { margin: 4px 0 0; color: #6b7280; font-size: 0.9rem; }

    .tabs { display: flex; gap: 0; border-bottom: 2px solid #e5e7eb; margin-bottom: 24px; }
    .tabs button { padding: 12px 24px; border: none; background: none; cursor: pointer; font-size: 0.95rem; color: #6b7280; border-bottom: 2px solid transparent; margin-bottom: -2px; transition: all 0.2s; }
    .tabs button:hover { color: #0d9488; }
    .tabs button.active { color: #0d9488; border-bottom-color: #0d9488; font-weight: 600; }

    .tab-content { animation: fadeIn 0.2s ease; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }

    .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .section-header h3 { margin: 0; color: #134e4a; font-size: 1.15rem; }

    .type-filters { display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap; }
    .type-filters button { padding: 6px 16px; border: 1px solid #d1d5db; border-radius: 20px; background: white; cursor: pointer; font-size: 0.82rem; color: #6b7280; transition: all 0.2s; }
    .type-filters button:hover { border-color: #0d9488; color: #0d9488; }
    .type-filters button.active { background: #0d9488; color: white; border-color: #0d9488; }

    .filter-bar { display: flex; align-items: flex-end; gap: 12px; margin-bottom: 16px; flex-wrap: wrap; }
    .field-inline { display: flex; flex-direction: column; gap: 4px; }
    .field-inline label { font-size: 0.78rem; color: #6b7280; font-weight: 500; }
    .field-inline input, .field-inline select { padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 0.88rem; outline: none; }
    .field-inline input:focus, .field-inline select:focus { border-color: #0d9488; box-shadow: 0 0 0 3px rgba(13,148,136,0.1); }
    .btn-filter { padding: 8px 18px; background: #0d9488; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 0.85rem; font-weight: 500; }
    .btn-filter:hover { background: #0f766e; }
    .btn-clear { padding: 8px 18px; background: white; color: #6b7280; border: 1px solid #d1d5db; border-radius: 6px; cursor: pointer; font-size: 0.85rem; }
    .btn-clear:hover { background: #f9fafb; }

    .btn-primary { padding: 8px 20px; background: #0d9488; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 0.88rem; font-weight: 500; transition: background 0.2s; }
    .btn-primary:hover { background: #0f766e; }

    .form-card { background: white; border-radius: 10px; padding: 24px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); border: 1px solid #e5e7eb; }
    .form-card h4 { margin: 0 0 16px; color: #134e4a; font-size: 1rem; }
    .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; }
    .field { display: flex; flex-direction: column; gap: 6px; }
    .field-full { grid-column: 1 / -1; }
    .field label { font-size: 0.82rem; font-weight: 500; color: #374151; }
    .field input, .field select { padding: 9px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 0.9rem; outline: none; background: white; }
    .field input:focus, .field select:focus { border-color: #0d9488; box-shadow: 0 0 0 3px rgba(13,148,136,0.1); }
    .form-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 18px; padding-top: 16px; border-top: 1px solid #f3f4f6; }
    .btn-cancel { padding: 8px 20px; background: white; color: #6b7280; border: 1px solid #d1d5db; border-radius: 6px; cursor: pointer; font-size: 0.88rem; }
    .btn-cancel:hover { background: #f9fafb; }

    .summary-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 20px; }
    .summary-card { background: white; border-radius: 10px; padding: 20px; display: flex; align-items: center; gap: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); border: 1px solid #e5e7eb; }
    .summary-icon { width: 48px; height: 48px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.8rem; flex-shrink: 0; }
    .total-icon { background: #f0fdfa; color: #0d9488; }
    .approved-icon { background: #dcfce7; color: #16a34a; font-size: 1.2rem; }
    .pending-icon { background: #fef9c3; color: #ca8a04; font-size: 1.2rem; font-weight: 800; }
    .month-icon { background: #ede9fe; color: #7c3aed; font-size: 1rem; }
    .summary-info { display: flex; flex-direction: column; }
    .summary-value { font-size: 1.15rem; font-weight: 700; color: #134e4a; }
    .summary-label { font-size: 0.78rem; color: #6b7280; margin-top: 2px; }

    .table-card { background: white; border-radius: 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); border: 1px solid #e5e7eb; overflow: hidden; }
    table { width: 100%; border-collapse: collapse; }
    thead th { background: #f8fafc; padding: 12px 16px; text-align: left; font-size: 0.78rem; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e5e7eb; }
    tbody td { padding: 12px 16px; border-bottom: 1px solid #f3f4f6; font-size: 0.88rem; color: #374151; }
    tbody tr:hover { background: #f8fafc; }
    .code-cell { font-family: 'SF Mono', 'Fira Code', monospace; font-weight: 500; color: #0d9488; }
    .amount-cell { font-weight: 600; font-family: 'SF Mono', 'Fira Code', monospace; }
    .empty-row { text-align: center; color: #9ca3af; padding: 32px 16px !important; font-style: italic; }

    .badge { padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 600; white-space: nowrap; }
    .badge-asset { background: #dbeafe; color: #1d4ed8; }
    .badge-liability { background: #fce7f3; color: #be185d; }
    .badge-equity { background: #ede9fe; color: #7c3aed; }
    .badge-revenue { background: #dcfce7; color: #15803d; }
    .badge-expense { background: #fee2e2; color: #dc2626; }
    .badge-category { background: #f0fdfa; color: #0d9488; }
    .badge-draft { background: #f3f4f6; color: #6b7280; }
    .badge-posted { background: #dcfce7; color: #15803d; }
    .badge-reversed { background: #fee2e2; color: #dc2626; }
    .badge-pending { background: #fef9c3; color: #ca8a04; }
    .badge-approved { background: #dcfce7; color: #15803d; }
    .badge-rejected { background: #fee2e2; color: #dc2626; }

    .status-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #d1d5db; margin-right: 4px; vertical-align: middle; }
    .status-dot.active { background: #16a34a; }

    .actions-cell { white-space: nowrap; }
    .btn-icon { width: 32px; height: 32px; border: none; background: #f3f4f6; border-radius: 6px; cursor: pointer; font-size: 0.85rem; color: #6b7280; transition: all 0.2s; margin-right: 4px; }
    .btn-icon:hover { background: #e5e7eb; color: #134e4a; }
    .btn-icon.btn-danger:hover { background: #fee2e2; color: #dc2626; }
  `]
})
export class AccountingComponent implements OnInit {
  activeTab: 'accounts' | 'journal' | 'expenses' = 'accounts';

  accounts: Account[] = [];
  filteredAccounts: Account[] = [];
  accountTypeFilter = '';
  showAccountForm = false;
  editingAccountId: number | null = null;
  accountForm: Partial<Account> = this.emptyAccountForm();

  journalEntries: JournalEntry[] = [];
  showEntryForm = false;
  editingEntryId: number | null = null;
  entryForm: Partial<JournalEntry> = this.emptyEntryForm();
  entryDebitAccountId = '';
  entryCreditAccountId = '';
  dateFilterStart = '';
  dateFilterEnd = '';

  allExpenses: Expense[] = [];
  filteredExpenses: Expense[] = [];
  showExpenseForm = false;
  editingExpenseId: number | null = null;
  expenseForm: Partial<Expense> = this.emptyExpenseForm();
  expenseCategoryFilter = '';

  totalExpenses = 0;
  approvedExpenses = 0;
  pendingExpenses = 0;
  thisMonthExpenses = 0;

  constructor(
    private accountService: AccountService,
    private journalEntryService: JournalEntryService,
    private expenseService: ExpenseService
  ) {}

  ngOnInit(): void {
    this.loadAccounts();
    this.loadJournalEntries();
    this.loadExpenses();
  }

  loadAccounts(): void {
    this.accountService.getAll().subscribe({
      next: (data) => { this.accounts = data; this.applyAccountFilter(); },
      error: () => { this.accounts = []; this.filteredAccounts = []; }
    });
  }

  filterAccountsByType(type: string): void {
    this.accountTypeFilter = type;
    this.applyAccountFilter();
  }

  applyAccountFilter(): void {
    this.filteredAccounts = this.accountTypeFilter
      ? this.accounts.filter(a => a.type === this.accountTypeFilter)
      : [...this.accounts];
  }

  saveAccount(): void {
    if (!this.accountForm.code || !this.accountForm.name || !this.accountForm.type) return;
    if (this.editingAccountId) {
      this.accountService.update(this.editingAccountId, this.accountForm as Account).subscribe({
        next: () => { this.loadAccounts(); this.cancelAccountForm(); }
      });
    } else {
      this.accountService.create(this.accountForm as Account).subscribe({
        next: () => { this.loadAccounts(); this.cancelAccountForm(); }
      });
    }
  }

  editAccount(account: Account): void {
    this.editingAccountId = account.id!;
    this.accountForm = { code: account.code, name: account.name, type: account.type, description: account.description };
    this.showAccountForm = true;
  }

  deleteAccount(id: number): void {
    this.accountService.delete(id).subscribe({ next: () => this.loadAccounts() });
  }

  cancelAccountForm(): void {
    this.showAccountForm = false;
    this.editingAccountId = null;
    this.accountForm = this.emptyAccountForm();
  }

  loadJournalEntries(): void {
    this.journalEntryService.getAll().subscribe({
      next: (data) => this.journalEntries = data,
      error: () => this.journalEntries = []
    });
  }

  filterEntriesByDate(): void {
    if (this.dateFilterStart && this.dateFilterEnd) {
      this.journalEntryService.getByDateRange(this.dateFilterStart, this.dateFilterEnd).subscribe({
        next: (data) => this.journalEntries = data,
        error: () => this.loadJournalEntries()
      });
    }
  }

  clearDateFilter(): void {
    this.dateFilterStart = '';
    this.dateFilterEnd = '';
    this.loadJournalEntries();
  }

  saveEntry(): void {
    if (!this.entryForm.date || !this.entryForm.description || !this.entryForm.amount) return;
    const debitAcc = this.accounts.find(a => a.id === +this.entryDebitAccountId);
    const creditAcc = this.accounts.find(a => a.id === +this.entryCreditAccountId);
    const entry: JournalEntry = {
      ...this.entryForm,
      debitAccount: debitAcc,
      creditAccount: creditAcc
    } as JournalEntry;
    if (this.editingEntryId) {
      this.journalEntryService.update(this.editingEntryId, entry).subscribe({
        next: () => { this.loadJournalEntries(); this.cancelEntryForm(); }
      });
    } else {
      this.journalEntryService.create(entry).subscribe({
        next: () => { this.loadJournalEntries(); this.cancelEntryForm(); }
      });
    }
  }

  editEntry(entry: JournalEntry): void {
    this.editingEntryId = entry.id!;
    this.entryForm = { date: entry.date, description: entry.description, amount: entry.amount, status: entry.status };
    this.entryDebitAccountId = entry.debitAccount?.id?.toString() || '';
    this.entryCreditAccountId = entry.creditAccount?.id?.toString() || '';
    this.showEntryForm = true;
  }

  deleteEntry(id: number): void {
    this.journalEntryService.delete(id).subscribe({ next: () => this.loadJournalEntries() });
  }

  cancelEntryForm(): void {
    this.showEntryForm = false;
    this.editingEntryId = null;
    this.entryForm = this.emptyEntryForm();
    this.entryDebitAccountId = '';
    this.entryCreditAccountId = '';
  }

  loadExpenses(): void {
    this.expenseService.getAll().subscribe({
      next: (data) => {
        this.allExpenses = data;
        this.computeExpenseSummary();
        this.filterExpenses();
      },
      error: () => { this.allExpenses = []; this.filteredExpenses = []; }
    });
  }

  computeExpenseSummary(): void {
    this.totalExpenses = this.allExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    this.approvedExpenses = this.allExpenses.filter(e => e.status === 'APPROVED').reduce((sum, e) => sum + (e.amount || 0), 0);
    this.pendingExpenses = this.allExpenses.filter(e => e.status === 'PENDING').reduce((sum, e) => sum + (e.amount || 0), 0);
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    this.thisMonthExpenses = this.allExpenses.filter(e => {
      const d = new Date(e.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).reduce((sum, e) => sum + (e.amount || 0), 0);
  }

  filterExpenses(): void {
    this.filteredExpenses = this.expenseCategoryFilter
      ? this.allExpenses.filter(e => e.category === this.expenseCategoryFilter)
      : [...this.allExpenses];
  }

  saveExpense(): void {
    if (!this.expenseForm.description || !this.expenseForm.amount || !this.expenseForm.date) return;
    if (this.editingExpenseId) {
      this.expenseService.update(this.editingExpenseId, this.expenseForm as Expense).subscribe({
        next: () => { this.loadExpenses(); this.cancelExpenseForm(); }
      });
    } else {
      this.expenseService.create(this.expenseForm as Expense).subscribe({
        next: () => { this.loadExpenses(); this.cancelExpenseForm(); }
      });
    }
  }

  editExpense(expense: Expense): void {
    this.editingExpenseId = expense.id!;
    this.expenseForm = {
      description: expense.description,
      amount: expense.amount,
      category: expense.category,
      date: expense.date,
      paymentMethod: expense.paymentMethod,
      status: expense.status,
      notes: expense.notes
    };
    this.showExpenseForm = true;
  }

  deleteExpense(id: number): void {
    this.expenseService.delete(id).subscribe({ next: () => this.loadExpenses() });
  }

  cancelExpenseForm(): void {
    this.showExpenseForm = false;
    this.editingExpenseId = null;
    this.expenseForm = this.emptyExpenseForm();
  }

  private emptyAccountForm(): Partial<Account> {
    return { code: '', name: '', type: 'ASSET', description: '' };
  }

  private emptyEntryForm(): Partial<JournalEntry> {
    return { date: '', description: '', amount: 0, status: 'DRAFT' };
  }

  private emptyExpenseForm(): Partial<Expense> {
    return { description: '', amount: 0, category: 'OTHER', date: '', paymentMethod: 'CASH', status: 'PENDING', notes: '' };
  }
}
