import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';
import { DepartmentService } from '../../services/department.service';
import { AttendanceService } from '../../services/attendance.service';
import { Employee, Department, Attendance } from '../../models/models';

@Component({
  selector: 'app-hrm',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="hrm-container">
      <div class="hrm-header">
        <h1>Human Resource Management</h1>
        <div class="header-tabs">
          <button [class.active]="activeTab === 'employees'" (click)="activeTab = 'employees'">
            <span class="tab-icon">👥</span> Employees
          </button>
          <button [class.active]="activeTab === 'attendance'" (click)="activeTab = 'attendance'; loadAttendance()">
            <span class="tab-icon">📋</span> Attendance
          </button>
        </div>
      </div>

      <div class="hrm-content" *ngIf="activeTab === 'employees'">
        <div class="summary-cards">
          <div class="summary-card">
            <div class="card-icon total">👥</div>
            <div class="card-info">
              <div class="card-value">{{ employees.length }}</div>
              <div class="card-label">Total Employees</div>
            </div>
          </div>
          <div class="summary-card">
            <div class="card-icon active">✓</div>
            <div class="card-info">
              <div class="card-value">{{ activeCount }}</div>
              <div class="card-label">Active</div>
            </div>
          </div>
          <div class="summary-card">
            <div class="card-icon leave">🏖</div>
            <div class="card-info">
              <div class="card-value">{{ onLeaveCount }}</div>
              <div class="card-label">On Leave</div>
            </div>
          </div>
          <div class="summary-card">
            <div class="card-icon dept">🏢</div>
            <div class="card-info">
              <div class="card-value">{{ departments.length }}</div>
              <div class="card-label">Departments</div>
            </div>
          </div>
        </div>

        <div class="controls-bar">
          <div class="filter-group">
            <select [(ngModel)]="departmentFilter" (ngModelChange)="filterEmployees()">
              <option value="">All Departments</option>
              <option *ngFor="let d of departments" [value]="d.id">{{ d.name }}</option>
            </select>
          </div>
          <button class="btn-primary" (click)="openForm()">+ Add Employee</button>
        </div>

        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Department</th>
                <th>Position</th>
                <th>Status</th>
                <th>Salary</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let emp of filteredEmployees">
                <td><span class="code-badge">{{ emp.employeeCode }}</span></td>
                <td>
                  <div class="emp-name">{{ emp.firstName }} {{ emp.lastName }}</div>
                  <div class="emp-email">{{ emp.email }}</div>
                </td>
                <td>{{ emp.department?.name || '—' }}</td>
                <td>{{ emp.position }}</td>
                <td>
                  <span class="status-badge" [ngClass]="emp.status?.toLowerCase()">{{ emp.status }}</span>
                </td>
                <td>{{ emp.salary | number:'1.2-3' }} TND</td>
                <td class="actions-cell">
                  <button class="btn-edit" (click)="editEmployee(emp)">Edit</button>
                  <button class="btn-delete" (click)="deleteEmployee(emp.id!)">Delete</button>
                </td>
              </tr>
              <tr *ngIf="filteredEmployees.length === 0">
                <td colspan="7" class="empty-row">No employees found</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="modal-overlay" *ngIf="showForm" (click)="closeForm()">
          <div class="modal-card" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h3>{{ editingId ? 'Edit Employee' : 'Add Employee' }}</h3>
              <button class="btn-close" (click)="closeForm()">✕</button>
            </div>
            <form (ngSubmit)="saveEmployee()" class="modal-form">
              <div class="form-row">
                <div class="field">
                  <label>First Name *</label>
                  <input type="text" [(ngModel)]="form.firstName" name="firstName" required>
                </div>
                <div class="field">
                  <label>Last Name *</label>
                  <input type="text" [(ngModel)]="form.lastName" name="lastName" required>
                </div>
              </div>
              <div class="form-row">
                <div class="field">
                  <label>Email</label>
                  <input type="email" [(ngModel)]="form.email" name="email">
                </div>
                <div class="field">
                  <label>Phone</label>
                  <input type="text" [(ngModel)]="form.phone" name="phone">
                </div>
              </div>
              <div class="form-row">
                <div class="field">
                  <label>Department</label>
                  <select [(ngModel)]="form.departmentId" name="departmentId">
                    <option value="">Select Department</option>
                    <option *ngFor="let d of departments" [ngValue]="d.id">{{ d.name }}</option>
                  </select>
                </div>
                <div class="field">
                  <label>Position *</label>
                  <input type="text" [(ngModel)]="form.position" name="position" required>
                </div>
              </div>
              <div class="form-row">
                <div class="field">
                  <label>Status</label>
                  <select [(ngModel)]="form.status" name="status">
                    <option value="ACTIVE">Active</option>
                    <option value="ON_LEAVE">On Leave</option>
                    <option value="TERMINATED">Terminated</option>
                  </select>
                </div>
                <div class="field">
                  <label>Hire Date</label>
                  <input type="date" [(ngModel)]="form.hireDate" name="hireDate">
                </div>
              </div>
              <div class="field">
                <label>Salary (TND)</label>
                <input type="number" [(ngModel)]="form.salary" name="salary" step="0.001">
              </div>
              <div class="modal-actions">
                <button type="button" class="btn-secondary" (click)="closeForm()">Cancel</button>
                <button type="submit" class="btn-primary">{{ editingId ? 'Update' : 'Create' }}</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div class="hrm-content" *ngIf="activeTab === 'attendance'">
        <div class="controls-bar">
          <div class="filter-group">
            <label>Date:</label>
            <input type="date" [(ngModel)]="selectedDate" (ngModelChange)="loadAttendanceByDate()">
          </div>
          <button class="btn-primary" (click)="openAttendanceForm()">+ Add Record</button>
        </div>

        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Date</th>
                <th>Clock In</th>
                <th>Clock Out</th>
                <th>Status</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let att of attendanceList">
                <td>
                  <div class="emp-name">{{ att.employee?.firstName }} {{ att.employee?.lastName }}</div>
                  <div class="emp-email">{{ att.employee?.employeeCode }}</div>
                </td>
                <td>{{ att.date }}</td>
                <td>{{ att.clockIn || '—' }}</td>
                <td>{{ att.clockOut || '—' }}</td>
                <td>
                  <span class="status-badge" [ngClass]="att.status.toLowerCase()">{{ att.status }}</span>
                </td>
                <td>{{ att.notes || '—' }}</td>
                <td class="actions-cell">
                  <button class="btn-edit" (click)="editAttendance(att)">Edit</button>
                  <button class="btn-delete" (click)="deleteAttendance(att.id!)">Delete</button>
                </td>
              </tr>
              <tr *ngIf="attendanceList.length === 0">
                <td colspan="7" class="empty-row">No attendance records found</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="modal-overlay" *ngIf="showAttendanceForm" (click)="closeAttendanceForm()">
          <div class="modal-card" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h3>{{ editingAttendanceId ? 'Edit Attendance' : 'Add Attendance' }}</h3>
              <button class="btn-close" (click)="closeAttendanceForm()">✕</button>
            </div>
            <form (ngSubmit)="saveAttendance()" class="modal-form">
              <div class="field">
                <label>Employee *</label>
                <select [(ngModel)]="attForm.employeeId" name="employeeId" required>
                  <option value="">Select Employee</option>
                  <option *ngFor="let emp of employees" [ngValue]="emp.id">{{ emp.firstName }} {{ emp.lastName }}</option>
                </select>
              </div>
              <div class="form-row">
                <div class="field">
                  <label>Date *</label>
                  <input type="date" [(ngModel)]="attForm.date" name="date" required>
                </div>
                <div class="field">
                  <label>Status *</label>
                  <select [(ngModel)]="attForm.status" name="status" required>
                    <option value="PRESENT">Present</option>
                    <option value="ABSENT">Absent</option>
                    <option value="LATE">Late</option>
                    <option value="HALF_DAY">Half Day</option>
                    <option value="ON_LEAVE">On Leave</option>
                  </select>
                </div>
              </div>
              <div class="form-row">
                <div class="field">
                  <label>Clock In</label>
                  <input type="time" [(ngModel)]="attForm.clockIn" name="clockIn">
                </div>
                <div class="field">
                  <label>Clock Out</label>
                  <input type="time" [(ngModel)]="attForm.clockOut" name="clockOut">
                </div>
              </div>
              <div class="field">
                <label>Notes</label>
                <input type="text" [(ngModel)]="attForm.notes" name="notes">
              </div>
              <div class="modal-actions">
                <button type="button" class="btn-secondary" (click)="closeAttendanceForm()">Cancel</button>
                <button type="submit" class="btn-primary">{{ editingAttendanceId ? 'Update' : 'Create' }}</button>
              </div>
            </form>
          </div>
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
    .hrm-container {
      min-height: 100vh;
      background: #f0fdfa;
      padding: 0 24px 24px;
    }

    .hrm-header {
      background: linear-gradient(135deg, #134e4a 0%, #0d9488 100%);
      margin: 0 -24px 24px;
      padding: 20px 24px;
      color: white;
      border-radius: 0 0 16px 16px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .hrm-header h1 {
      margin: 0 0 16px;
      font-size: 1.5rem;
      font-weight: 700;
    }

    .header-tabs {
      display: flex;
      gap: 8px;
    }

    .header-tabs button {
      padding: 10px 20px;
      background: rgba(255,255,255,0.1);
      border: 1px solid rgba(255,255,255,0.2);
      color: white;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.9rem;
      font-weight: 500;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .header-tabs button:hover {
      background: rgba(255,255,255,0.2);
    }

    .header-tabs button.active {
      background: white;
      color: #134e4a;
      border-color: white;
    }

    .tab-icon {
      font-size: 1rem;
    }

    .summary-cards {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 24px;
    }

    .summary-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
      border: 1px solid #e5e7eb;
    }

    .card-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.3rem;
    }

    .card-icon.total { background: #f0fdfa; color: #0d9488; }
    .card-icon.active { background: #ecfdf5; color: #059669; }
    .card-icon.leave { background: #fef3c7; color: #d97706; }
    .card-icon.dept { background: #ede9fe; color: #7c3aed; }

    .card-info { flex: 1; }

    .card-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1f2937;
    }

    .card-label {
      font-size: 0.8rem;
      color: #6b7280;
      margin-top: 2px;
    }

    .controls-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      background: white;
      padding: 12px 16px;
      border-radius: 10px;
      border: 1px solid #e5e7eb;
    }

    .filter-group {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .filter-group label {
      font-size: 0.85rem;
      font-weight: 500;
      color: #374151;
    }

    .filter-group select, .filter-group input {
      padding: 8px 12px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 0.85rem;
      outline: none;
    }

    .filter-group select:focus, .filter-group input:focus {
      border-color: #0d9488;
      box-shadow: 0 0 0 3px rgba(13,148,136,0.1);
    }

    .btn-primary {
      padding: 10px 20px;
      background: #0d9488;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }

    .btn-primary:hover { background: #0f766e; }

    .btn-secondary {
      padding: 10px 20px;
      background: #f3f4f6;
      color: #374151;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 0.85rem;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s;
    }

    .btn-secondary:hover { background: #e5e7eb; }

    .table-container {
      background: white;
      border-radius: 12px;
      border: 1px solid #e5e7eb;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    thead th {
      background: #f9fafb;
      padding: 12px 16px;
      text-align: left;
      font-size: 0.8rem;
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 1px solid #e5e7eb;
    }

    tbody td {
      padding: 12px 16px;
      font-size: 0.85rem;
      color: #374151;
      border-bottom: 1px solid #f3f4f6;
    }

    tbody tr:hover {
      background: #f0fdfa;
    }

    .code-badge {
      background: #f0fdfa;
      color: #0d9488;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .emp-name {
      font-weight: 500;
      color: #1f2937;
    }

    .emp-email {
      font-size: 0.75rem;
      color: #9ca3af;
    }

    .status-badge {
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .status-badge.active { background: #ecfdf5; color: #059669; }
    .status-badge.on_leave { background: #fef3c7; color: #d97706; }
    .status-badge.terminated { background: #fee2e2; color: #dc2626; }
    .status-badge.present { background: #ecfdf5; color: #059669; }
    .status-badge.absent { background: #fee2e2; color: #dc2626; }
    .status-badge.late { background: #fef3c7; color: #d97706; }
    .status-badge.half_day { background: #ede9fe; color: #7c3aed; }

    .actions-cell {
      display: flex;
      gap: 6px;
    }

    .btn-edit {
      padding: 5px 10px;
      background: #f0fdfa;
      color: #0d9488;
      border: 1px solid #0d9488;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s;
    }

    .btn-edit:hover { background: #0d9488; color: white; }

    .btn-delete {
      padding: 5px 10px;
      background: #fee2e2;
      color: #dc2626;
      border: 1px solid #dc2626;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s;
    }

    .btn-delete:hover { background: #dc2626; color: white; }

    .empty-row {
      text-align: center;
      color: #9ca3af;
      padding: 32px !important;
    }

    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      backdrop-filter: blur(4px);
    }

    .modal-card {
      background: white;
      border-radius: 16px;
      width: 560px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 60px rgba(0,0,0,0.2);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      border-bottom: 1px solid #e5e7eb;
    }

    .modal-header h3 {
      margin: 0;
      font-size: 1.1rem;
      color: #134e4a;
    }

    .btn-close {
      background: none;
      border: none;
      font-size: 1.2rem;
      color: #9ca3af;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 6px;
    }

    .btn-close:hover { background: #f3f4f6; color: #374151; }

    .modal-form {
      padding: 24px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .field {
      margin-bottom: 16px;
    }

    .field label {
      display: block;
      font-size: 0.8rem;
      font-weight: 500;
      color: #374151;
      margin-bottom: 6px;
    }

    .field input, .field select {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 0.9rem;
      outline: none;
      box-sizing: border-box;
    }

    .field input:focus, .field select:focus {
      border-color: #0d9488;
      box-shadow: 0 0 0 3px rgba(13,148,136,0.1);
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 8px;
      padding-top: 16px;
      border-top: 1px solid #e5e7eb;
    }

    .toast-success, .toast-warning {
      position: fixed;
      top: 24px;
      right: 24px;
      padding: 14px 20px;
      border-radius: 10px;
      font-size: 0.9rem;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 8px;
      z-index: 1001;
      animation: slideIn 0.3s ease-out;
      box-shadow: 0 4px 16px rgba(0,0,0,0.15);
    }

    .toast-success { background: #065f46; color: white; }
    .toast-warning { background: #92400e; color: white; }
    .toast-icon { font-size: 1.1rem; font-weight: 700; }

    @keyframes slideIn {
      from { transform: translateX(100px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `]
})
export class HrmComponent implements OnInit {
  activeTab: 'employees' | 'attendance' = 'employees';
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  departments: Department[] = [];
  attendanceList: Attendance[] = [];

  departmentFilter = '';
  selectedDate = new Date().toISOString().split('T')[0];

  showForm = false;
  editingId: number | null = null;
  form: any = this.emptyForm();

  showAttendanceForm = false;
  editingAttendanceId: number | null = null;
  attForm: any = this.emptyAttForm();

  successMessage = '';
  warningMessage = '';

  constructor(
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private attendanceService: AttendanceService
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
    this.loadDepartments();
  }

  get activeCount(): number {
    return this.employees.filter(e => e.status === 'ACTIVE').length;
  }

  get onLeaveCount(): number {
    return this.employees.filter(e => e.status === 'ON_LEAVE').length;
  }

  loadEmployees(): void {
    this.employeeService.getAll().subscribe({
      next: (data) => { this.employees = data; this.filterEmployees(); },
      error: () => this.showWarning('Failed to load employees')
    });
  }

  loadDepartments(): void {
    this.departmentService.getAll().subscribe({
      next: (data) => this.departments = data,
      error: () => this.showWarning('Failed to load departments')
    });
  }

  loadAttendance(): void {
    this.attendanceService.getAll().subscribe({
      next: (data) => this.attendanceList = data,
      error: () => this.showWarning('Failed to load attendance')
    });
  }

  loadAttendanceByDate(): void {
    this.attendanceService.getByDate(this.selectedDate).subscribe({
      next: (data) => this.attendanceList = data,
      error: () => this.showWarning('Failed to load attendance for this date')
    });
  }

  filterEmployees(): void {
    if (this.departmentFilter) {
      this.filteredEmployees = this.employees.filter(e => e.department?.id?.toString() === this.departmentFilter);
    } else {
      this.filteredEmployees = [...this.employees];
    }
  }

  emptyForm(): any {
    return { firstName: '', lastName: '', email: '', phone: '', departmentId: '', position: '', status: 'ACTIVE', hireDate: '', salary: null };
  }

  openForm(): void {
    this.form = this.emptyForm();
    this.editingId = null;
    this.showForm = true;
  }

  editEmployee(emp: Employee): void {
    this.form = {
      firstName: emp.firstName, lastName: emp.lastName, email: emp.email || '',
      phone: emp.phone || '', departmentId: emp.department?.id || '',
      position: emp.position, status: emp.status || 'ACTIVE',
      hireDate: emp.hireDate || '', salary: emp.salary
    };
    this.editingId = emp.id!;
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.editingId = null;
  }

  saveEmployee(): void {
    const employee: Employee = {
      firstName: this.form.firstName,
      lastName: this.form.lastName,
      email: this.form.email || undefined,
      phone: this.form.phone || undefined,
      department: this.form.departmentId ? { id: this.form.departmentId } as Department : undefined,
      position: this.form.position,
      status: this.form.status,
      hireDate: this.form.hireDate || undefined,
      salary: this.form.salary || undefined
    };

    const req = this.editingId
      ? this.employeeService.update(this.editingId, employee)
      : this.employeeService.create(employee);

    req.subscribe({
      next: () => {
        this.showSuccess(this.editingId ? 'Employee updated' : 'Employee created');
        this.closeForm();
        this.loadEmployees();
      },
      error: () => this.showWarning('Failed to save employee')
    });
  }

  deleteEmployee(id: number): void {
    if (!confirm('Delete this employee?')) return;
    this.employeeService.delete(id).subscribe({
      next: () => { this.showSuccess('Employee deleted'); this.loadEmployees(); },
      error: () => this.showWarning('Failed to delete employee')
    });
  }

  emptyAttForm(): any {
    return { employeeId: '', date: new Date().toISOString().split('T')[0], clockIn: '', clockOut: '', status: 'PRESENT', notes: '' };
  }

  openAttendanceForm(): void {
    this.attForm = this.emptyAttForm();
    this.editingAttendanceId = null;
    this.showAttendanceForm = true;
  }

  editAttendance(att: Attendance): void {
    this.attForm = {
      employeeId: att.employee?.id || '',
      date: att.date, clockIn: att.clockIn || '', clockOut: att.clockOut || '',
      status: att.status, notes: att.notes || ''
    };
    this.editingAttendanceId = att.id!;
    this.showAttendanceForm = true;
  }

  closeAttendanceForm(): void {
    this.showAttendanceForm = false;
    this.editingAttendanceId = null;
  }

  saveAttendance(): void {
    const attendance: Attendance = {
      employee: this.attForm.employeeId ? { id: this.attForm.employeeId } as Employee : undefined,
      date: this.attForm.date,
      clockIn: this.attForm.clockIn || undefined,
      clockOut: this.attForm.clockOut || undefined,
      status: this.attForm.status,
      notes: this.attForm.notes || undefined
    };

    const req = this.editingAttendanceId
      ? this.attendanceService.update(this.editingAttendanceId, attendance)
      : this.attendanceService.create(attendance);

    req.subscribe({
      next: () => {
        this.showSuccess(this.editingAttendanceId ? 'Attendance updated' : 'Attendance recorded');
        this.closeAttendanceForm();
        this.loadAttendanceByDate();
      },
      error: () => this.showWarning('Failed to save attendance')
    });
  }

  deleteAttendance(id: number): void {
    if (!confirm('Delete this attendance record?')) return;
    this.attendanceService.delete(id).subscribe({
      next: () => { this.showSuccess('Record deleted'); this.loadAttendanceByDate(); },
      error: () => this.showWarning('Failed to delete record')
    });
  }

  showSuccess(msg: string): void {
    this.successMessage = msg;
    setTimeout(() => this.successMessage = '', 3000);
  }

  showWarning(msg: string): void {
    this.warningMessage = msg;
    setTimeout(() => this.warningMessage = '', 3000);
  }
}
