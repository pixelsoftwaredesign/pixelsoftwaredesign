import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DealService } from '../../services/deal.service';
import { ProjectService } from '../../services/project.service';
import { TaskService } from '../../services/task.service';
import { Project, Task } from '../../models/models';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="padding:20px">
      <h2>Project and Task Management</h2>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:15px;margin-bottom:30px">
        <div *ngFor="let p of projects" (click)="select(p)" style="cursor:pointer;border-radius:8px;padding:15px;transition:all 0.2s"
             [style.border]="selected?.id===p.id?'2px solid #4f46e5':'2px solid transparent'"
             [style.background]="selected?.id===p.id?'#eef2ff':'#f8f9fa'">
          <h3 style="margin:0">{{p.name}}</h3>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px">
            <span style="padding:3px 10px;border-radius:12px;font-size:0.75rem;font-weight:600"
                  [style.background]="p.status==='PLANNING'?'#dbeafe':p.status==='IN_PROGRESS'?'#fef3c7':p.status==='ON_HOLD'?'#fce7f3':'#d1fae5'"
                  [style.color]="p.status==='PLANNING'?'#1d4ed8':p.status==='IN_PROGRESS'?'#d97706':p.status==='ON_HOLD'?'#db2777':'#059669'">{{p.status}}</span>
            <span *ngIf="p.deadline" style="font-size:0.8rem;color:#94a3b8">Due: {{p.deadline | date:'mediumDate'}}</span>
          </div>
        </div>
      </div>
      <div *ngIf="selected">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px">
          <h3>Tasks: {{selected.name}}</h3>
          <button style="background:#4f46e5;color:white;border:none;padding:10px 20px;border-radius:6px;cursor:pointer" (click)="showForm=!showForm">
            {{showForm?'Cancel':'+ Add Task'}}
          </button>
        </div>
        <div *ngIf="showForm" style="background:#f8f9fa;padding:20px;border-radius:8px;margin-bottom:20px">
          <form (ngSubmit)="saveTask()">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:15px">
              <input [(ngModel)]="task.title" name="title" placeholder="Task Title" required style="padding:10px;border:1px solid #ddd;border-radius:4px">
              <select [(ngModel)]="task.priority" name="priority" style="padding:10px;border:1px solid #ddd;border-radius:4px">
                <option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option><option value="URGENT">Urgent</option>
              </select>
              <input [(ngModel)]="task.dueDate" name="dueDate" type="date" style="padding:10px;border:1px solid #ddd;border-radius:4px">
            </div>
            <button type="submit" style="background:#4f46e5;color:white;border:none;padding:10px 20px;border-radius:6px;cursor:pointer">Create</button>
          </form>
        </div>
        <table style="width:100%;border-collapse:collapse;background:white;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08)">
          <thead><tr style="background:#f8f9fa">
            <th style="padding:12px;text-align:left;font-size:0.85rem">Title</th>
            <th style="padding:12px;text-align:left;font-size:0.85rem">Priority</th>
            <th style="padding:12px;text-align:left;font-size:0.85rem">Status</th>
            <th style="padding:12px;text-align:left;font-size:0.85rem">Due Date</th>
            <th style="padding:12px;text-align:left;font-size:0.85rem">Actions</th>
          </tr></thead>
          <tbody>
            <tr *ngFor="let t of tasks" style="border-bottom:1px solid #f1f5f9">
              <td style="padding:12px;font-weight:500">{{t.title}}</td>
              <td style="padding:12px"><span style="padding:3px 8px;border-radius:4px;font-size:0.75rem;font-weight:600"
                [style.background]="t.priority==='URGENT'?'#fecaca':t.priority==='HIGH'?'#fed7aa':'#e2e8f0'"
                [style.color]="t.priority==='URGENT'?'#dc2626':t.priority==='HIGH'?'#ea580c':'#64748b'">{{t.priority}}</span></td>
              <td style="padding:12px"><select [ngModel]="t.status" (ngModelChange)="updateStatus(t.id!,$event)" style="padding:5px;border:1px solid #ddd;border-radius:4px;font-size:0.85rem">
                <option value="TODO">Todo</option><option value="IN_PROGRESS">In Progress</option><option value="REVIEW">Review</option><option value="DONE">Done</option>
              </select></td>
              <td style="padding:12px;font-size:0.85rem;color:#64748b">{{t.dueDate | date:'mediumDate'}}</td>
              <td style="padding:12px"><button (click)="removeTask(t.id!)" style="background:#ef4444;color:white;border:none;padding:4px 8px;border-radius:4px;cursor:pointer;font-size:0.8rem">Del</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = []; tasks: Task[] = []; selected: Project | null = null;
  task: Task = { title: '', priority: 'MEDIUM', status: 'TODO' }; showForm = false;

  constructor(private projectService: ProjectService, private taskService: TaskService) {}
  ngOnInit() { this.projectService.getAll().subscribe(p => this.projects = p); }
  select(p: Project) { this.selected = p; this.projectService.getTasks(p.id!).subscribe(t => this.tasks = t); }
  saveTask() { this.task.project = this.selected!; this.taskService.create(this.task).subscribe(() => { this.projectService.getTasks(this.selected!.id!).subscribe(t => this.tasks = t); this.task = { title: '', priority: 'MEDIUM', status: 'TODO' }; this.showForm = false; }); }
  updateStatus(id: number, status: string) { this.taskService.updateStatus(id, status).subscribe(() => this.projectService.getTasks(this.selected!.id!).subscribe(t => this.tasks = t)); }
  removeTask(id: number) { if (confirm('Delete?')) this.taskService.delete(id).subscribe(() => this.projectService.getTasks(this.selected!.id!).subscribe(t => this.tasks = t)); }
}
