import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DealService } from '../../services/deal.service';
import { Deal } from '../../models/models';

@Component({
  selector: 'app-pipeline',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="padding:20px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
        <h2>Sales Pipeline ({{deals.length}} deals)</h2>
        <div style="display:flex;gap:10px">
          <span style="background:#f1f5f9;padding:8px 14px;border-radius:6px;font-size:0.85rem">Total: <strong>{{totalValue | number:'1.0-0'}} TND</strong></span>
          <span style="background:#d1fae5;padding:8px 14px;border-radius:6px;font-size:0.85rem;color:#059669">Forecast: <strong>{{totalWeighted | number:'1.0-0'}} TND</strong></span>
          <button style="background:#4f46e5;color:white;border:none;padding:10px 20px;border-radius:6px;cursor:pointer" (click)="showForm=!showForm">
            {{showForm ? 'Cancel' : '+ New Deal'}}
          </button>
        </div>
      </div>

      <!-- Form -->
      <div *ngIf="showForm" style="background:#f8f9fa;padding:20px;border-radius:8px;margin-bottom:20px">
        <form (ngSubmit)="save()">
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:15px">
            <input [(ngModel)]="cur.title" name="title" placeholder="Deal Title *" required style="padding:10px;border:1px solid #ddd;border-radius:4px">
            <input [(ngModel)]="cur.dealValue" name="dealValue" type="number" placeholder="Value (TND) *" required style="padding:10px;border:1px solid #ddd;border-radius:4px">
            <input [(ngModel)]="cur.probability" name="probability" type="number" placeholder="Probability %" style="padding:10px;border:1px solid #ddd;border-radius:4px">
            <input [(ngModel)]="cur.expectedClosingDate" name="expectedClosingDate" type="date" style="padding:10px;border:1px solid #ddd;border-radius:4px">
            <select [(ngModel)]="cur.stage" name="stage" style="padding:10px;border:1px solid #ddd;border-radius:4px">
              <option value="PROSPECTING">Prospecting</option><option value="QUALIFICATION">Qualification</option>
              <option value="PROPOSAL">Proposal</option><option value="NEGOTIATION">Negotiation</option>
            </select>
            <select [(ngModel)]="cur.priority" name="priority" style="padding:10px;border:1px solid #ddd;border-radius:4px">
              <option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option><option value="URGENT">Urgent</option>
            </select>
            <select [(ngModel)]="cur.source" name="source" style="padding:10px;border:1px solid #ddd;border-radius:4px">
              <option value="">Source...</option><option value="Website">Website</option><option value="Referral">Referral</option>
              <option value="Cold Call">Cold Call</option><option value="LinkedIn">LinkedIn</option><option value="Conference">Conference</option>
              <option value="Partner">Partner</option><option value="Instagram">Instagram</option><option value="Other">Other</option>
            </select>
          </div>
          <textarea [(ngModel)]="cur.description" name="description" placeholder="Description" rows="2" style="width:100%;padding:10px;border:1px solid #ddd;border-radius:4px;margin-bottom:10px"></textarea>
          <button type="submit" style="background:#4f46e5;color:white;border:none;padding:10px 20px;border-radius:6px;cursor:pointer">
            {{editId ? 'Update' : 'Create'}}
          </button>
        </form>
      </div>

      <!-- Kanban -->
      <div style="display:flex;gap:12px;overflow-x:auto;padding-bottom:10px">
        <div *ngFor="let stage of stages" style="min-width:280px;background:#f1f5f9;border-radius:8px;padding:10px">
          <div [style.background]="getColor(stage)" style="display:flex;justify-content:space-between;padding:10px;border-radius:6px;color:white;margin-bottom:10px">
            <h4 style="margin:0;font-size:0.8rem;text-transform:uppercase">{{stage}}</h4>
            <span style="background:rgba(255,255,255,0.3);padding:2px 8px;border-radius:10px;font-size:0.75rem">
              {{stageTotal(stage) | number:'1.0-0'}} TND
            </span>
          </div>
          <div *ngFor="let d of byStage(stage)" style="background:white;border-radius:6px;padding:12px;margin-bottom:8px;box-shadow:0 1px 3px rgba(0,0,0,0.1)">
            <div style="display:flex;justify-content:space-between;align-items:start">
              <p style="margin:0;font-weight:600;font-size:0.9rem">{{d.title}}</p>
              <button (click)="remove(d.id!)" style="background:none;border:none;cursor:pointer;color:#94a3b8;font-size:0.8rem">X</button>
            </div>
            <p style="margin:3px 0;font-size:0.8rem;color:#64748b">{{d.company?.name || 'No company'}}</p>
            <div style="display:flex;gap:6px;margin:6px 0;flex-wrap:wrap">
              <span style="font-weight:600;color:{{getColor(stage)}};font-size:0.9rem">{{d.dealValue | number:'1.0-0'}} TND</span>
              <span *ngIf="d.probability" style="font-size:0.7rem;background:#f1f5f9;padding:2px 6px;border-radius:4px">{{d.probability}}%</span>
              <span *ngIf="d.priority" style="font-size:0.7rem;padding:2px 6px;border-radius:4px"
                    [style.background]="d.priority==='URGENT'?'#fecaca':d.priority==='HIGH'?'#fed7aa':'#e2e8f0'"
                    [style.color]="d.priority==='URGENT'?'#dc2626':d.priority==='HIGH'?'#ea580c':'#64748b'">{{d.priority}}</span>
            </div>
            <div *ngIf="d.expectedClosingDate" style="font-size:0.75rem;color:#94a3b8">Closing: {{d.expectedClosingDate | date:'mediumDate'}}</div>
            <div style="display:flex;gap:4px;margin-top:6px" *ngIf="stage!=='WON'&&stage!=='LOST'">
              <button *ngFor="let next of getNextStages(stage)" (click)="move(d,next)" style="background:#e2e8f0;border:none;padding:2px 8px;border-radius:4px;cursor:pointer;font-size:0.7rem">
                {{next}} →
              </button>
            </div>
            <div *ngIf="stage!=='WON'&&stage!=='LOST'" style="display:flex;gap:4px;margin-top:4px">
              <button (click)="move(d,'WON')" style="background:#22c55e;color:white;border:none;padding:3px 10px;border-radius:4px;cursor:pointer;font-size:0.75rem">Won</button>
              <button (click)="move(d,'LOST')" style="background:#ef4444;color:white;border:none;padding:3px 10px;border-radius:4px;cursor:pointer;font-size:0.75rem">Lost</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PipelineComponent implements OnInit {
  deals: Deal[] = [];
  cur: Deal = { title: '', stage: 'PROSPECTING', dealValue: 0, probability: 20, priority: 'MEDIUM' };
  editId: number | null = null;
  showForm = false;
  totalValue = 0; totalWeighted = 0;
  stages = ['PROSPECTING', 'QUALIFICATION', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST'];
  private colors: Record<string,string> = {PROSPECTING:'#6366f1',QUALIFICATION:'#f59e0b',PROPOSAL:'#3b82f6',NEGOTIATION:'#8b5cf6',WON:'#22c55e',LOST:'#ef4444'};
  private nextStageMap: Record<string,string[]> = {PROSPECTING:['QUALIFICATION'],QUALIFICATION:['PROPOSAL'],PROPOSAL:['NEGOTIATION'],NEGOTIATION:['WON']};

  constructor(private service: DealService) {}
  ngOnInit() { this.load(); }
  load() { this.service.getAll().subscribe(d => { this.deals = d; this.totalValue = d.filter(x=>x.stage!=='WON'&&x.stage!=='LOST').reduce((s,x)=>s+x.dealValue,0); this.totalWeighted = d.filter(x=>x.stage!=='WON'&&x.stage!=='LOST').reduce((s,x)=>s+(x.weightedValue||0),0); }); }
  save() { const op = this.editId ? this.service.update(this.editId, this.cur) : this.service.create(this.cur); op.subscribe(() => { this.load(); this.reset(); }); }
  move(d: Deal, stage: string) { this.service.updateStage(d.id!, stage).subscribe(() => this.load()); }
  remove(id: number) { if (confirm('Delete?')) this.service.delete(id).subscribe(() => this.load()); }
  byStage(s: string) { return this.deals.filter(d => d.stage === s); }
  stageTotal(s: string) { return this.byStage(s).reduce((sum, d) => sum + d.dealValue, 0); }
  getColor(s: string) { return this.colors[s] || '#6b7280'; }
  getNextStages(s: string) { return this.nextStageMap[s] || []; }
  reset() { this.cur = { title: '', stage: 'PROSPECTING', dealValue: 0, probability: 20, priority: 'MEDIUM' }; this.editId = null; this.showForm = false; }
}
