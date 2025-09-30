import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CartService } from '../../../core/services/cart.service';

// PUBLIC_INTERFACE
@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  template: `
  <div class="overlay" (click)="close.emit()">
    <aside class="drawer" (click)="$event.stopPropagation()">
      <header>
        <h3>Your Cart</h3>
        <button class="close" (click)="close.emit()">✕</button>
      </header>

      <div class="items" *ngIf="vm.items.length; else empty">
        <div class="item" *ngFor="let it of vm.items">
          <div class="meta">
            <div class="name">{{ it.product.title }}</div>
            <div class="price">{{ it.product.price | currency:it.product.currency }}</div>
          </div>
          <div class="qty">
            <button (click)="dec(it.product.id)">-</button>
            <input type="number" [value]="it.quantity" (input)="set(it.product.id, $any($event.target).value)" />
            <button (click)="inc(it.product.id)">+</button>
          </div>
          <button class="remove" (click)="remove(it.product.id)">Remove</button>
        </div>
      </div>
      <ng-template #empty>
        <div class="empty">Your cart is empty.</div>
      </ng-template>

      <footer>
        <div class="row"><span>Subtotal</span><span>{{ vm.subtotal | currency:'USD' }}</span></div>
        <button class="btn primary" [disabled]="!vm.items.length" (click)="proceed.emit()">Checkout</button>
      </footer>
    </aside>
  </div>
  `,
  styles: [`
  .overlay { position:fixed; inset:0; background: rgba(17,24,39,0.45); display:flex; justify-content:flex-end; z-index:70; }
  .drawer {
    width: 100%; max-width: 420px; height: 100%;
    background:#fff; border-left: 1px solid rgba(0,0,0,0.06);
    box-shadow: -8px 0 24px rgba(0,0,0,0.18);
    display:flex; flex-direction:column; animation: slideIn .2s ease-out;
  }
  @keyframes slideIn { from { transform: translateX(30px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  header { display:flex; align-items:center; justify-content: space-between; padding: 1rem; border-bottom:1px solid rgba(0,0,0,0.06); }
  .items { padding: .5rem 1rem; overflow:auto; flex:1; display:flex; flex-direction:column; gap:.75rem; }
  .item { padding:.75rem; border:1px solid rgba(0,0,0,0.06); border-radius:.75rem; display:grid; grid-template-columns: 1fr auto; gap:.5rem; }
  .meta .name { font-weight: 600; color:#111827; }
  .meta .price { color:#2563EB; font-weight:700; }
  .qty { display:flex; align-items:center; gap:.25rem; }
  .qty button { padding:.25rem .5rem; border-radius:.5rem; border:1px solid rgba(0,0,0,0.1); background:#fff; cursor:pointer; }
  .qty input { width: 60px; padding:.25rem .5rem; border:1px solid rgba(0,0,0,0.1); border-radius:.5rem; }
  .remove { justify-self:end; border:none; background:transparent; color:#EF4444; cursor:pointer; }
  footer { padding: 1rem; border-top:1px solid rgba(0,0,0,0.06); display:flex; flex-direction:column; gap:.75rem; }
  .row { display:flex; justify-content:space-between; font-weight:700; }
  .btn.primary { background:#2563EB; color:#fff; border:none; padding:.75rem; border-radius:.75rem; font-weight:700; cursor:pointer; }
  .empty { padding: 2rem; text-align:center; color:#6b7280; }
  `]
})
export class CartDrawerComponent {
  private cart = inject(CartService);

  vm = { items: this.cart.snapshot, subtotal: 0 };

  constructor() {
    this.cart.items$.subscribe(items => {
      this.vm.items = items;
      this.vm.subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
    });
  }

  @Output() close = new EventEmitter<void>();
  @Output() proceed = new EventEmitter<void>();

  inc(id: string) {
    const item = this.vm.items.find(i => i.product.id === id);
    if (item) this.cart.updateQuantity(id, item.quantity + 1);
  }
  dec(id: string) {
    const item = this.vm.items.find(i => i.product.id === id);
    if (item) this.cart.updateQuantity(id, item.quantity - 1);
  }
  set(id: string, value: string) {
    const qty = parseInt(value, 10) || 0;
    this.cart.updateQuantity(id, qty);
  }
  remove(id: string) {
    this.cart.remove(id);
  }
}
