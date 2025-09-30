import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { CartService } from '../../../core/services/cart.service';
import { CheckoutAddress, CheckoutPayment, CheckoutRequest } from '../../../core/models/product.model';
import { Router } from '@angular/router';

// PUBLIC_INTERFACE
@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="page">
    <h2>Checkout</h2>
    <div class="grid">
      <section class="card">
        <h3>Shipping</h3>
        <form class="form">
          <div class="row">
            <label>Full name</label>
            <input [(ngModel)]="address.fullName" name="fullName" required />
          </div>
          <div class="row">
            <label>Address line 1</label>
            <input [(ngModel)]="address.line1" name="line1" required />
          </div>
          <div class="row">
            <label>Address line 2</label>
            <input [(ngModel)]="address.line2" name="line2" />
          </div>
          <div class="row grid2">
            <div>
              <label>City</label>
              <input [(ngModel)]="address.city" name="city" required />
            </div>
            <div>
              <label>State</label>
              <input [(ngModel)]="address.state" name="state" required />
            </div>
          </div>
          <div class="row grid2">
            <div>
              <label>Postal Code</label>
              <input [(ngModel)]="address.postalCode" name="postal" required />
            </div>
            <div>
              <label>Country</label>
              <input [(ngModel)]="address.country" name="country" required />
            </div>
          </div>
          <div class="row">
            <label>Email</label>
            <input [(ngModel)]="address.email" name="email" required type="email" />
          </div>
        </form>
      </section>

      <section class="card">
        <h3>Payment</h3>
        <div class="row">
          <label>Method</label>
          <select [(ngModel)]="payment.method" name="method">
            <option value="card">Card</option>
            <option value="paypal">PayPal</option>
            <option value="cod">Cash on Delivery</option>
          </select>
        </div>
        <div *ngIf="payment.method==='card'">
          <div class="row">
            <label>Card Number</label>
            <input [(ngModel)]="payment.cardNumber" name="cardNumber" />
          </div>
          <div class="row grid2">
            <div>
              <label>Exp Month</label>
              <input [(ngModel)]="payment.expMonth" name="expMonth" />
            </div>
            <div>
              <label>Exp Year</label>
              <input [(ngModel)]="payment.expYear" name="expYear" />
            </div>
          </div>
          <div class="row">
            <label>CVC</label>
            <input [(ngModel)]="payment.cvc" name="cvc" />
          </div>
        </div>
      </section>

      <section class="card summary">
        <h3>Order Summary</h3>
        <div class="line" *ngFor="let it of vm.items">
          <div class="name">{{ it.product.title }} × {{ it.quantity }}</div>
          <div class="price">{{ it.product.price * it.quantity | currency:it.product.currency }}</div>
        </div>
        <div class="sep"></div>
        <div class="line"><span>Subtotal</span><span>{{ vm.subtotal | currency:'USD' }}</span></div>
        <div class="line"><span>Shipping</span><span>{{ vm.shipping | currency:'USD' }}</span></div>
        <div class="line"><span>Tax</span><span>{{ vm.tax | currency:'USD' }}</span></div>
        <div class="line total"><span>Total</span><span>{{ vm.total | currency:'USD' }}</span></div>
        <button class="btn primary" (click)="placeOrder()" [disabled]="!vm.items.length || vm.placing">Place Order</button>
      </section>
    </div>
  </div>
  `,
  styles: [`
  .page { padding: 1rem; }
  h2 { margin-bottom: 1rem; color:#111827; }
  .grid { display:grid; grid-template-columns: 2fr 2fr 1.3fr; gap: 1rem; }
  .card { background:#fff; border-radius: 1rem; border:1px solid rgba(0,0,0,0.06); box-shadow: 0 8px 24px rgba(0,0,0,0.06); padding: 1rem; }
  .form .row { display:flex; flex-direction:column; gap:.25rem; margin-bottom:.6rem; }
  .grid2 { display:grid !important; grid-template-columns: 1fr 1fr; gap: .6rem; }
  input, select { padding:.6rem .8rem; border-radius:.6rem; border:1px solid rgba(0,0,0,0.1); outline:none; }
  .summary .line { display:flex; justify-content:space-between; padding: .25rem 0; }
  .summary .sep { border-top:1px dashed rgba(0,0,0,0.1); margin:.5rem 0; }
  .summary .total { font-weight:800; color:#111827; }
  .btn.primary { margin-top: .75rem; width:100%; background:#2563EB; color:#fff; border:none; padding:.75rem; border-radius:.75rem; font-weight:700; cursor:pointer; }
  @media (max-width: 1024px) { .grid { grid-template-columns: 1fr; } }
  `]
})
export class CheckoutPageComponent {
  private api = inject(ApiService);
  private cart = inject(CartService);
  private router = inject(Router);

  address: CheckoutAddress = {
    fullName: '',
    line1: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    email: '',
  };
  payment: CheckoutPayment = { method: 'card' };

  vm = { items: this.cart.snapshot, subtotal: 0, shipping: 0, tax: 0, total: 0, placing: false };

  constructor() {
    this.cart.items$.subscribe(items => {
      this.vm.items = items;
      const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
      const shipping = subtotal > 100 ? 0 : 7.99;
      const tax = subtotal * 0.08;
      this.vm.subtotal = round2(subtotal);
      this.vm.shipping = round2(shipping);
      this.vm.tax = round2(tax);
      this.vm.total = round2(subtotal + shipping + tax);
    });
  }

  placeOrder() {
    if (!this.vm.items.length) return;
    this.vm.placing = true;
    const req: CheckoutRequest = {
      address: this.address,
      payment: this.payment,
      items: this.vm.items.map(i => ({ productId: i.product.id, quantity: i.quantity })),
    };
    this.api.checkout(req).subscribe({
      next: (resp) => {
        this.cart.clear();
        this.router.navigate(['/checkout/confirmation'], { queryParams: { id: resp.orderId, total: resp.summary.total } });
      },
      error: () => {
        alert('Checkout failed. Please try again.');
        this.vm.placing = false;
      }
    });
  }
}

function round2(n: number) { return Math.round(n * 100) / 100; }
