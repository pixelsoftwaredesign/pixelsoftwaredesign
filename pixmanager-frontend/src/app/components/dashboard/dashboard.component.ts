import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DealService } from '../../services/deal.service';
import { CompanyService } from '../../services/company.service';
import { InvoiceService } from '../../services/invoice.service';
import { InteractionService } from '../../services/interaction.service';
import { Deal, Company, Invoice, Interaction } from '../../models/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding:20px">
      <h2>Executive Dashboard</h2>

      <!-- KPI Cards -->
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:15px;margin-bottom:25px">
        <div style="background:linear-gradient(135deg,#4f46e5,#7c3aed);border-radius:10px;padding:20px;color:white">
          <p style="margin:0;font-size:0.85rem;opacity:0.8">Active Deals</p>
          <p style="margin:5px 0 0;font-size:2rem;font-weight:bold">{{activeDeals}}</p>
        </div>
        <div style="background:linear-gradient(135deg,#059669,#10b981);border-radius:10px;padding:20px;color:white">
          <p style="margin:0;font-size:0.85rem;opacity:0.8">Pipeline Value</p>
          <p style="margin:5px 0 0;font-size:2rem;font-weight:bold">{{pipelineValue | number:'1.0-0'}} TND</p>
        </div>
        <div style="background:linear-gradient(135deg,#d97706,#f59e0b);border-radius:10px;padding:20px;color:white">
          <p style="margin:0;font-size:0.85rem;opacity:0.8">Weighted Forecast</p>
          <p style="margin:5px 0 0;font-size:2rem;font-weight:bold">{{weightedForecast | number:'1.0-0'}} TND</p>
        </div>
        <div style="background:linear-gradient(135deg,#dc2626,#ef4444);border-radius:10px;padding:20px;color:white">
          <p style="margin:0;font-size:0.85rem;opacity:0.8">Conversion Rate</p>
          <p style="margin:5px 0 0;font-size:2rem;font-weight:bold">{{conversionRate}}%</p>
        </div>
      </div>

      <!-- Second Row KPIs -->
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:15px;margin-bottom:25px">
        <div style="background:white;border-radius:10px;padding:20px;box-shadow:0 1px 3px rgba(0,0,0,0.08)">
          <p style="margin:0;color:#64748b;font-size:0.85rem">Total Companies</p>
          <p style="margin:5px 0 0;font-size:1.5rem;font-weight:bold;color:#1e293b">{{companies.length}}</p>
          <div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap">
            <span *ngFor="let t of ['B2B','B2C','B2B2C']" style="font-size:0.7rem;padding:2px 6px;border-radius:4px;background:#f1f5f9">{{t}}: {{countByType(t)}}</span>
          </div>
        </div>
        <div style="background:white;border-radius:10px;padding:20px;box-shadow:0 1px 3px rgba(0,0,0,0.08)">
          <p style="margin:0;color:#64748b;font-size:0.85rem">Pending Follow-ups</p>
          <p style="margin:5px 0 0;font-size:1.5rem;font-weight:bold;color:#f59e0b">{{pendingFollowUps}}</p>
        </div>
        <div style="background:white;border-radius:10px;padding:20px;box-shadow:0 1px 3px rgba(0,0,0,0.08)">
          <p style="margin:0;color:#64748b;font-size:0.85rem">Open Invoices</p>
          <p style="margin:5px 0 0;font-size:1.5rem;font-weight:bold;color:#3b82f6">{{openInvoices}}</p>
        </div>
        <div style="background:white;border-radius:10px;padding:20px;box-shadow:0 1px 3px rgba(0,0,0,0.08)">
          <p style="margin:0;color:#64748b;font-size:0.85rem">Revenue (Paid)</p>
          <p style="margin:5px 0 0;font-size:1.5rem;font-weight:bold;color:#059669">{{paidRevenue | number:'1.0-0'}} TND</p>
        </div>
      </div>

      <!-- Pipeline Kanban -->
      <h3>Sales Pipeline</h3>
      <div style="display:flex;gap:12px;overflow-x:auto;padding-bottom:10px;margin-bottom:25px">
        <div *ngFor="let stage of stages" style="min-width:260px;background:#f8fafc;border-radius:8px;padding:12px;border:1px solid #e2e8f0">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
            <h4 style="margin:0;font-size:0.8rem;text-transform:uppercase;color:{{getStageColor(stage)}}">{{stage}}</h4>
            <span style="font-size:0.75rem;color:#94a3b8">{{byStage(stage).length}} deals</span>
          </div>
          <div *ngFor="let deal of byStage(stage)" style="background:white;border-radius:6px;padding:10px;margin-bottom:6px;box-shadow:0 1px 2px rgba(0,0,0,0.05);border-left:3px solid {{getStageColor(stage)}}">
            <p style="margin:0;font-size:0.85rem;font-weight:600">{{deal.title}}</p>
            <p style="margin:3px 0 0;font-size:0.8rem;color:#64748b">{{deal.company?.name || 'N/A'}}</p>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:5px">
              <span style="font-weight:600;color:{{getStageColor(stage)}}">{{deal.dealValue | number:'1.0-0'}} TND</span>
              <span style="font-size:0.7rem;background:#f1f5f9;padding:2px 6px;border-radius:4px">{{deal.probability || 0}}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Industry Breakdown -->
      <h3>Companies by Industry</h3>
      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:25px">
        <div *ngFor="let ind of industries" style="background:white;border-radius:8px;padding:12px 16px;box-shadow:0 1px 2px rgba(0,0,0,0.05)">
          <span style="font-weight:600;color:#1e293b">{{ind}}</span>
          <span style="margin-left:8px;font-size:0.85rem;color:#64748b">{{countByIndustry(ind)}}</span>
        </div>
      </div>

      <!-- Recent Interactions -->
      <h3>Recent Interactions</h3>
      <div style="background:white;border-radius:8px;box-shadow:0 1px 3px rgba(0,0,0,0.08);overflow:hidden">
        <div *ngFor="let i of interactions.slice(0,5); let last = last"
             [style.border-bottom]="!last?'1px solid #f1f5f9':'none'"
             style="display:flex;align-items:center;padding:12px 16px;gap:12px">
          <span style="width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.75rem;font-weight:600;color:white"
                [style.background]="getInteractionColor(i.type)">{{i.type[0]}}</span>
          <div style="flex:1">
            <p style="margin:0;font-weight:500;font-size:0.9rem">{{i.subject}}</p>
            <p style="margin:2px 0 0;font-size:0.8rem;color:#94a3b8">{{i.company?.name}} - {{i.type}}</p>
          </div>
          <span style="font-size:0.75rem;color:#94a3b8">{{i.interactionDate | date:'shortDate'}}</span>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  deals: Deal[] = [];
  companies: Company[] = [];
  interactions: Interaction[] = [];
  invoices: Invoice[] = [];
  activeDeals = 0; pipelineValue = 0; weightedForecast = 0; conversionRate = 0;
  pendingFollowUps = 0; openInvoices = 0; paidRevenue = 0;
  stages = ['PROSPECTING', 'QUALIFICATION', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST'];
  industries: string[] = [];
  private stageColors: Record<string,string> = {PROSPECTING:'#6366f1',QUALIFICATION:'#f59e0b',PROPOSAL:'#3b82f6',NEGOTIATION:'#8b5cf6',WON:'#22c55e',LOST:'#ef4444'};
  private interactionColors: Record<string,string> = {CALL:'#22c55e',EMAIL:'#3b82f6',MEETING:'#8b5cf6',NOTE:'#6b7280',FOLLOW_UP:'#f59e0b',SUPPORT_TICKET:'#ef4444'};

  constructor(private dealService: DealService, private companyService: CompanyService,
              private invoiceService: InvoiceService, private interactionService: InteractionService) {}

  ngOnInit() {
    this.dealService.getAll().subscribe(d => {
      this.deals = d;
      this.activeDeals = d.filter(x => x.stage !== 'WON' && x.stage !== 'LOST').length;
      this.pipelineValue = d.filter(x => x.stage !== 'WON' && x.stage !== 'LOST').reduce((s, x) => s + x.dealValue, 0);
      this.weightedForecast = d.filter(x => x.stage !== 'WON' && x.stage !== 'LOST').reduce((s, x) => s + (x.weightedValue || 0), 0);
      const total = d.length; const won = d.filter(x => x.stage === 'WON').length;
      this.conversionRate = total > 0 ? Math.round((won / total) * 100) : 0;
    });
    this.companyService.getAll().subscribe(c => {
      this.companies = c;
      this.industries = [...new Set(c.map(x => x.industry).filter((x): x is string => Boolean(x)))];
    });
    this.invoiceService.getAll().subscribe(i => {
      this.invoices = i;
      this.openInvoices = i.filter(x => x.status === 'SENT' || x.status === 'OVERDUE').length;
      this.paidRevenue = i.filter(x => x.status === 'PAID').reduce((s, x) => s + x.totalAmount, 0);
    });
    this.interactionService.getAll().subscribe(i => this.interactions = i);
    this.interactionService.getPendingFollowUps().subscribe(f => this.pendingFollowUps = f.length);
  }

  byStage(s: string) { return this.deals.filter(d => d.stage === s); }
  countByType(t: string) { return this.companies.filter(c => c.type === t).length; }
  countByIndustry(i: string) { return this.companies.filter(c => c.industry === i).length; }
  getStageColor(s: string) { return this.stageColors[s] || '#6b7280'; }
  getInteractionColor(t: string) { return this.interactionColors[t] || '#6b7280'; }
}
