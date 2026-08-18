import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InvoiceService } from '../../services/invoice.service';
import { InvoiceItemService } from '../../services/invoice-item.service';
import { PaymentService } from '../../services/payment.service';
import { Invoice, InvoiceItem, Payment } from '../../models/models';

@Component({
  selector: 'app-finances',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="padding:20px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
        <h2>Financial Management</h2>
        <button style="background:#4f46e5;color:white;border:none;padding:10px 20px;border-radius:6px;cursor:pointer" (click)="showForm=!showForm">
          {{showForm?'Cancel':'+ New Document'}}
        </button>
      </div>

      <!-- Summary -->
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:15px;margin-bottom:20px">
        <div style="background:white;border-radius:10px;padding:20px;box-shadow:0 1px 3px rgba(0,0,0,0.08)">
          <p style="margin:0;color:#64748b;font-size:0.85rem">Paid Revenue</p>
          <p style="margin:5px 0 0;font-size:1.3rem;font-weight:bold;color:#059669">{{revenue | number:'1.0-0'}} TND</p>
        </div>
        <div style="background:white;border-radius:10px;padding:20px;box-shadow:0 1px 3px rgba(0,0,0,0.08)">
          <p style="margin:0;color:#64748b;font-size:0.85rem">Pending</p>
          <p style="margin:5px 0 0;font-size:1.3rem;font-weight:bold;color:#f59e0b">{{pending | number:'1.0-0'}} TND</p>
        </div>
        <div style="background:white;border-radius:10px;padding:20px;box-shadow:0 1px 3px rgba(0,0,0,0.08)">
          <p style="margin:0;color:#64748b;font-size:0.85rem">Overdue</p>
          <p style="margin:5px 0 0;font-size:1.3rem;font-weight:bold;color:#ef4444">{{overdue | number:'1.0-0'}} TND</p>
        </div>
        <div style="background:white;border-radius:10px;padding:20px;box-shadow:0 1px 3px rgba(0,0,0,0.08)">
          <p style="margin:0;color:#64748b;font-size:0.85rem">Total Tax</p>
          <p style="margin:5px 0 0;font-size:1.3rem;font-weight:bold;color:#8b5cf6">{{totalTax | number:'1.0-0'}} TND</p>
        </div>
      </div>

      <!-- Form -->
      <div *ngIf="showForm" style="background:#f8f9fa;padding:20px;border-radius:8px;margin-bottom:20px">
        <form (ngSubmit)="save()">
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:15px">
            <input [(ngModel)]="cur.invoiceNumber" name="invoiceNumber" placeholder="Number *" required style="padding:10px;border:1px solid #ddd;border-radius:4px">
            <select [(ngModel)]="cur.type" name="type" style="padding:10px;border:1px solid #ddd;border-radius:4px">
              <option value="QUOTATION">Quotation</option><option value="INVOICE">Invoice</option>
            </select>
            <input [(ngModel)]="cur.totalAmount" name="totalAmount" type="number" placeholder="Total *" required style="padding:10px;border:1px solid #ddd;border-radius:4px">
            <input [(ngModel)]="cur.taxAmount" name="taxAmount" type="number" placeholder="Tax" style="padding:10px;border:1px solid #ddd;border-radius:4px">
            <select [(ngModel)]="cur.status" name="status" style="padding:10px;border:1px solid #ddd;border-radius:4px">
              <option value="DRAFT">Draft</option><option value="SENT">Sent</option><option value="PAID">Paid</option><option value="OVERDUE">Overdue</option>
            </select>
          </div>
          <button type="submit" style="background:#4f46e5;color:white;border:none;padding:10px 20px;border-radius:6px;cursor:pointer">Create</button>
        </form>
      </div>

      <!-- Table -->
      <table style="width:100%;border-collapse:collapse;background:white;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08)">
        <thead><tr style="background:#f8f9fa">
          <th style="padding:12px;text-align:left;font-size:0.85rem">Number</th>
          <th style="padding:12px;text-align:left;font-size:0.85rem">Type</th>
          <th style="padding:12px;text-align:left;font-size:0.85rem">Amount</th>
          <th style="padding:12px;text-align:left;font-size:0.85rem">Tax</th>
          <th style="padding:12px;text-align:left;font-size:0.85rem">Status</th>
          <th style="padding:12px;text-align:left;font-size:0.85rem">Due Date</th>
          <th style="padding:12px;text-align:left;font-size:0.85rem">Actions</th>
        </tr></thead>
        <tbody>
          <tr *ngFor="let i of invoices" style="border-bottom:1px solid #f1f5f9">
            <td style="padding:12px;font-weight:500">{{i.invoiceNumber}}</td>
            <td style="padding:12px"><span [style.background]="i.type==='QUOTATION'?'#dbeafe':'#d1fae5'" [style.color]="i.type==='QUOTATION'?'#1d4ed8':'#059669'" style="padding:3px 10px;border-radius:12px;font-size:0.75rem;font-weight:600">{{i.type}}</span></td>
            <td style="padding:12px;font-weight:600">{{i.totalAmount | number:'1.0-0'}} TND</td>
            <td style="padding:12px;color:#64748b">{{i.taxAmount | number:'1.0-0'}} TND</td>
            <td style="padding:12px"><span [style.background]="i.status==='PAID'?'#d1fae5':i.status==='OVERDUE'?'#fecaca':i.status==='SENT'?'#dbeafe':'#f1f5f9'" [style.color]="i.status==='PAID'?'#059669':i.status==='OVERDUE'?'#dc2626':i.status==='SENT'?'#1d4ed8':'#64748b'" style="padding:3px 10px;border-radius:12px;font-size:0.75rem;font-weight:600">{{i.status}}</span></td>
            <td style="padding:12px;font-size:0.85rem">{{i.dueDate | date:'mediumDate'}}</td>
            <td style="padding:12px">
              <button *ngIf="i.type==='QUOTATION'" (click)="convert(i.id!)" style="background:#22c55e;color:white;border:none;padding:4px 8px;border-radius:4px;cursor:pointer;margin-right:4px;font-size:0.8rem">Convert</button>
              <button (click)="remove(i.id!)" style="background:#ef4444;color:white;border:none;padding:4px 8px;border-radius:4px;cursor:pointer;font-size:0.8rem">Del</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class FinancesComponent implements OnInit {
  invoices: Invoice[] = [];
  cur: Invoice = { invoiceNumber: '', type: 'QUOTATION', status: 'DRAFT', totalAmount: 0, taxAmount: 0 };
  showForm = false;
  revenue = 0; pending = 0; overdue = 0; totalTax = 0;

  constructor(private service: InvoiceService) {}
  ngOnInit() { this.load(); }
  load() { this.service.getAll().subscribe(d => { this.invoices = d; this.revenue = d.filter(i=>i.type==='INVOICE'&&i.status==='PAID').reduce((s,i)=>s+i.totalAmount,0); this.pending = d.filter(i=>i.status==='SENT').reduce((s,i)=>s+i.totalAmount,0); this.overdue = d.filter(i=>i.status==='OVERDUE').reduce((s,i)=>s+i.totalAmount,0); this.totalTax = d.reduce((s,i)=>s+i.taxAmount,0); }); }
  save() { this.service.create(this.cur).subscribe(() => { this.load(); this.cur = { invoiceNumber:'',type:'QUOTATION',status:'DRAFT',totalAmount:0,taxAmount:0 }; this.showForm=false; }); }
  convert(id: number) { this.service.convert(id).subscribe(() => this.load()); }
  remove(id: number) { if (confirm('Delete?')) this.service.delete(id).subscribe(() => this.load()); }
}
