import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

// PUBLIC_INTERFACE
@Component({
  selector: 'app-confirmation-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
  <div class="wrap">
    <div class="card">
      <div class="icon">✅</div>
      <h2>Order Confirmed</h2>
      <p>Thank you for your purchase. Your order <strong>#{{orderId}}</strong> has been placed successfully.</p>
      <p>Total charged: <strong>{{ total | currency:'USD' }}</strong></p>
      <a class="btn primary" routerLink="/">Back to Home</a>
    </div>
  </div>
  `,
  styles: [`
  .wrap { padding: 2rem; display:flex; justify-content:center; }
  .card { background:#fff; border-radius: 1rem; padding: 2rem; max-width: 560px; text-align:center; border:1px solid rgba(0,0,0,0.06); box-shadow: 0 8px 24px rgba(0,0,0,0.06); }
  .icon { font-size: 3rem; margin-bottom: .5rem; }
  .btn.primary { display:inline-block; margin-top: 1rem; background:#2563EB; color:#fff; border:none; padding:.75rem 1rem; border-radius:.75rem; font-weight:700; text-decoration:none; }
  `]
})
export class ConfirmationPageComponent {
  orderId = '';
  total = 0;
  constructor(route: ActivatedRoute) {
    route.queryParamMap.subscribe(p => {
      this.orderId = p.get('id') || '';
      this.total = parseFloat(p.get('total') || '0');
    });
  }
}
