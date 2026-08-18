import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pricing-page">
      <div class="page-header">
        <h2>Subscription Plans</h2>
        <p>Choose the plan that fits your business</p>
      </div>

      <div class="plans">
        <div class="plan">
          <div class="plan-icon" style="background: #e0e7ff; color: #4f46e5;">M</div>
          <h3>PixManager</h3>
          <p class="plan-desc">CRM & Business Management</p>
          <div class="price">
            <span class="amount">1,000</span>
            <span class="currency">TND</span>
            <span class="period">/month</span>
          </div>
          <ul class="features">
            <li>Contact Management</li>
            <li>Deal Pipeline</li>
            <li>Project Tracking</li>
            <li>Invoice Management</li>
            <li>Analytics Dashboard</li>
            <li>Client Portal</li>
          </ul>
          <button class="btn-plan current">Current Plan</button>
        </div>

        <div class="plan featured">
          <div class="plan-badge">Best Value</div>
          <div class="plan-icon" style="background: #fef3c7; color: #d97706;">BI</div>
          <h3>PixManager + PixERP</h3>
          <p class="plan-desc">Complete Business Intelligence Suite</p>
          <div class="price">
            <span class="amount">1,500</span>
            <span class="currency">TND</span>
            <span class="period">/month</span>
          </div>
          <ul class="features">
            <li>Everything in CRM</li>
            <li>Everything in ERP</li>
            <li>Cross-App Data Sync</li>
            <li>Unified Dashboard</li>
            <li>Advanced Analytics</li>
            <li>Priority Support</li>
          </ul>
          <button class="btn-plan featured-btn">Upgrade Now</button>
        </div>

        <div class="plan">
          <div class="plan-icon" style="background: #ccfbf1; color: #0d9488;">E</div>
          <h3>PixERP</h3>
          <p class="plan-desc">Enterprise Resource Planning</p>
          <div class="price">
            <span class="amount">1,000</span>
            <span class="currency">TND</span>
            <span class="period">/month</span>
          </div>
          <ul class="features">
            <li>Inventory Management</li>
            <li>Point of Sale</li>
            <li>HRM & Payroll</li>
            <li>Accounting</li>
            <li>Expense Tracking</li>
            <li>Department Management</li>
          </ul>
          <button class="btn-plan">Learn More</button>
        </div>
      </div>

      <div class="billing-note">
        <p>All prices are in Tunisian Dinar (TND). Billed monthly. Cancel anytime.</p>
      </div>
    </div>
  `,
  styles: [`
    .pricing-page { padding: 30px; }
    .page-header { text-align: center; margin-bottom: 50px; }
    .page-header h2 { margin: 0; font-size: 2rem; color: #1e1b4b; }
    .page-header p { margin: 10px 0 0; color: #6b7280; font-size: 1.1rem; }
    .plans { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; max-width: 1000px; margin: 0 auto; }
    .plan { background: white; border-radius: 16px; padding: 35px 30px; text-align: center; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 2px solid #e5e7eb; position: relative; transition: transform 0.2s; }
    .plan:hover { transform: translateY(-4px); }
    .plan.featured { border-color: #f59e0b; box-shadow: 0 8px 30px rgba(245,158,11,0.2); }
    .plan-badge { position: absolute; top: -14px; left: 50%; transform: translateX(-50%); background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 4px 16px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; }
    .plan-icon { width: 60px; height: 60px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 1.3rem; margin: 0 auto 15px; }
    .plan h3 { margin: 0; font-size: 1.3rem; color: #1e1b4b; }
    .plan-desc { margin: 5px 0 20px; font-size: 0.85rem; color: #6b7280; }
    .price { margin-bottom: 25px; }
    .amount { font-size: 2.5rem; font-weight: 800; color: #1e1b4b; }
    .currency { font-size: 1rem; color: #6b7280; font-weight: 500; }
    .period { font-size: 0.85rem; color: #9ca3af; }
    .features { list-style: none; padding: 0; margin: 0 0 30px; text-align: left; }
    .features li { padding: 8px 0; font-size: 0.9rem; color: #374151; border-bottom: 1px solid #f3f4f6; }
    .features li:last-child { border-bottom: none; }
    .features li::before { content: "✓ "; color: #059669; font-weight: 600; }
    .btn-plan { width: 100%; padding: 12px; border-radius: 10px; font-size: 0.95rem; font-weight: 600; cursor: pointer; border: 2px solid #e5e7eb; background: white; color: #374151; transition: all 0.2s; }
    .btn-plan:hover { border-color: #4f46e5; color: #4f46e5; }
    .btn-plan.current { border-color: #4f46e5; color: #4f46e5; cursor: default; }
    .btn-plan.featured-btn { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; border: none; }
    .btn-plan.featured-btn:hover { background: linear-gradient(135deg, #d97706, #b45309); }
    .billing-note { text-align: center; margin-top: 40px; }
    .billing-note p { color: #9ca3af; font-size: 0.85rem; }
  `]
})
export class PricingComponent {}
