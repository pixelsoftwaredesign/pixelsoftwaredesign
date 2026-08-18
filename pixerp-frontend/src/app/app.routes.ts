import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { PosComponent } from './components/pos/pos.component';
import { HrmComponent } from './components/hrm/hrm.component';
import { AccountingComponent } from './components/accounting/accounting.component';
import { SettingsComponent } from './components/settings/settings.component';
import { CrmDataComponent } from './components/crm-data/crm-data.component';
import { PricingComponent } from './components/pricing/pricing.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'inventory', component: InventoryComponent, canActivate: [AuthGuard] },
  { path: 'pos', component: PosComponent, canActivate: [AuthGuard] },
  { path: 'hrm', component: HrmComponent, canActivate: [AuthGuard] },
  { path: 'accounting', component: AccountingComponent, canActivate: [AuthGuard] },
  { path: 'crm-data', component: CrmDataComponent, canActivate: [AuthGuard] },
  { path: 'pricing', component: PricingComponent, canActivate: [AuthGuard] },
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
];
