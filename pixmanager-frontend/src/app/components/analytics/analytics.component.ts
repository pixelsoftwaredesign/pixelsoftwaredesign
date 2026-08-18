import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DealService } from '../../services/deal.service';
import { CompanyService } from '../../services/company.service';
import { InvoiceService } from '../../services/invoice.service';
import { Deal, Company, Invoice } from '../../models/models';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding:20px">
      <h2>Analytics and Reporting</h2>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">

        <!-- Pipeline -->
        <div style="background:white;border-radius:8px;padding:20px;box-shadow:0 1px 3px rgba(0,0,0,0.08)">
          <h3 style="margin:0 0 20px">Deal Pipeline</h3>
          <div *ngFor="let s of stages" style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
            <span style="width:110px;font-size:0.8rem;color:#64748b">{{s}}</span>
            <div style="flex:1;height:22px;background:#f1f5f9;border-radius:4px;overflow:hidden">
              <div [style.width.%]="pct(s)" [style.background]="col(s)" style="height:100%;border-radius:4px;transition:width 0.3s"></div>
            </div>
            <span style="width:30px;text-align:right;font-weight:600;font-size:0.85rem">{{count(s)}}</span>
          </div>
          <div style="margin-top:15px;padding-top:15px;border-top:1px solid #f1f5f9">
            <p style="margin:0;font-size:0.85rem;color:#64748b">Total Pipeline: <strong>{{totalVal | number:'1.0-0'}} TND</strong></p>
            <p style="margin:5px 0 0;font-size:0.85rem;color:#64748b">Weighted Forecast: <strong style="color:#059669">{{totalW | number:'1.0-0'}} TND</strong></p>
          </div>
        </div>

        <!-- Companies by Industry -->
        <div style="background:white;border-radius:8px;padding:20px;box-shadow:0 1px 3px rgba(0,0,0,0.08)">
          <h3 style="margin:0 0 20px">Companies by Industry</h3>
          <div *ngFor="let i of industries" style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
            <span style="width:140px;font-size:0.8rem;color:#64748b;text-overflow:ellipsis;overflow:hidden;white-space:nowrap">{{i}}</span>
            <div style="flex:1;height:22px;background:#f1f5f9;border-radius:4px;overflow:hidden">
              <div [style.width.%]="indPct(i)" style="background:#6366f1;height:100%;border-radius:4px;transition:width 0.3s"></div>
            </div>
            <span style="width:30px;text-align:right;font-weight:600;font-size:0.85rem">{{indCount(i)}}</span>
          </div>
        </div>

        <!-- Deal Sources -->
        <div style="background:white;border-radius:8px;padding:20px;box-shadow:0 1px 3px rgba(0,0,0,0.08)">
          <h3 style="margin:0 0 20px">Deal Sources</h3>
          <div *ngFor="let s of sources" style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f1f5f9">
            <span style="font-size:0.85rem">{{s}}</span>
            <span style="font-weight:600">{{sourceCount(s)}}</span>
          </div>
        </div>

        <!-- Invoice Summary -->
        <div style="background:white;border-radius:8px;padding:20px;box-shadow:0 1px 3px rgba(0,0,0,0.08)">
          <h3 style="margin:0 0 20px">Invoice Summary</h3>
          <div style="display:flex;flex-direction:column;gap:12px">
            <div style="display:flex;justify-content:space-between;padding:10px;background:#f8f9fa;border-radius:6px"><span style="color:#64748b">Quotations</span><span style="font-weight:600;color:#3b82f6">{{quotations}}</span></div>
            <div style="display:flex;justify-content:space-between;padding:10px;background:#f8f9fa;border-radius:6px"><span style="color:#64748b">Invoices</span><span style="font-weight:600;color:#059669">{{invoiceCount}}</span></div>
            <div style="display:flex;justify-content:space-between;padding:10px;background:#f8f9fa;border-radius:6px"><span style="color:#64748b">Conversion Rate</span><span style="font-weight:600;color:#4f46e5">{{convRate}}%</span></div>
            <div style="display:flex;justify-content:space-between;padding:10px;background:#f8f9fa;border-radius:6px"><span style="color:#64748b">Avg Deal Size</span><span style="font-weight:600;color:#d97706">{{avgDeal | number:'1.0-0'}} TND</span></div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AnalyticsComponent implements OnInit {
  deals: Deal[] = []; companies: Company[] = [];
  quotations = 0; invoiceCount = 0; convRate = 0; avgDeal = 0;
  totalVal = 0; totalW = 0;
  stages = ['PROSPECTING', 'QUALIFICATION', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST'];
  industries: string[] = []; sources: string[] = [];
  private colors: Record<string,string> = {PROSPECTING:'#6366f1',QUALIFICATION:'#f59e0b',PROPOSAL:'#3b82f6',NEGOTIATION:'#8b5cf6',WON:'#22c55e',LOST:'#ef4444'};

  constructor(private dealService: DealService, private companyService: CompanyService, private invoiceService: InvoiceService) {}
  ngOnInit() {
    this.dealService.getAll().subscribe(d => {
      this.deals = d; this.totalVal = d.filter(x=>x.stage!=='WON'&&x.stage!=='LOST').reduce((s,x)=>s+x.dealValue,0);
      this.totalW = d.filter(x=>x.stage!=='WON'&&x.stage!=='LOST').reduce((s,x)=>s+(x.weightedValue||0),0);
      const active = d.filter(x=>x.stage!=='WON'&&x.stage!=='LOST');
      this.avgDeal = active.length > 0 ? this.totalVal / active.length : 0;
      const won = d.filter(x=>x.stage==='WON').length;
      this.convRate = d.length > 0 ? Math.round((won / d.length) * 100) : 0;
      this.sources = [...new Set(d.map(x => x.source).filter((x): x is string => Boolean(x)))];
    });
    this.companyService.getAll().subscribe(c => { this.companies = c; this.industries = [...new Set(c.map(x=>x.industry).filter((x): x is string => Boolean(x)))]; });
    this.invoiceService.getAll().subscribe(i => { this.quotations = i.filter(x=>x.type==='QUOTATION').length; this.invoiceCount = i.filter(x=>x.type==='INVOICE').length; });
  }
  count(s: string) { return this.deals.filter(d => d.stage === s).length; }
  pct(s: string) { const max = Math.max(...this.stages.map(x => this.count(x)), 1); return (this.count(s) / max) * 100; }
  col(s: string) { return this.colors[s] || '#6b7280'; }
  indCount(i: string) { return this.companies.filter(c => c.industry === i).length; }
  indPct(i: string) { const max = Math.max(...this.industries.map(x => this.indCount(x)), 1); return (this.indCount(i) / max) * 100; }
  sourceCount(s: string) { return this.deals.filter(d => d.source === s).length; }
}
