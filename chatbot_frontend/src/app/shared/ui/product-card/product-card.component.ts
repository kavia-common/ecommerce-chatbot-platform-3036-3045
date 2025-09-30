import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../core/models/product.model';

// PUBLIC_INTERFACE
@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="card" (click)="view.emit(product)">
    <div class="image">
      <img [src]="product.imageUrl" [alt]="product.title" />
    </div>
    <div class="info">
      <div class="title">{{ product.title }}</div>
      <div class="price">{{ product.price | currency:product.currency }}</div>
    </div>
    <div class="actions" (click)="$event.stopPropagation()">
      <button class="btn primary" (click)="addToCart.emit(product)">Add</button>
      <button class="btn ghost" (click)="view.emit(product)">Details</button>
    </div>
  </div>
  `,
  styles: [`
  .card {
    display:flex; flex-direction: column; gap:.5rem;
    background:#fff; border-radius: 1rem; padding:.75rem;
    border: 1px solid rgba(0,0,0,0.06);
    box-shadow: 0 8px 24px rgba(0,0,0,0.06);
    cursor: pointer; transition: transform .1s ease, box-shadow .2s ease;
  }
  .card:hover { transform: translateY(-2px); box-shadow: 0 12px 30px rgba(0,0,0,0.08); }
  .image { width:100%; aspect-ratio: 1/1; overflow:hidden; border-radius:.75rem; background: #f3f4f6; display:flex; align-items:center; justify-content:center; }
  .image img { width:100%; height:100%; object-fit: contain; }
  .info { display:flex; align-items:center; justify-content: space-between; gap:.5rem; }
  .title { font-weight: 600; color:#111827; overflow:hidden; text-overflow: ellipsis; white-space: nowrap; }
  .price { color:#2563EB; font-weight:700; }
  .actions { display:flex; gap:.5rem; }
  .btn { padding:.5rem .75rem; border-radius:.6rem; border:1px solid transparent; font-weight:600; cursor:pointer; }
  .btn.primary { background:#2563EB; color:#fff; }
  .btn.ghost { background:#ffffff; color:#111827; border-color: rgba(0,0,0,0.08); }
  `]
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Output() addToCart = new EventEmitter<Product>();
  @Output() view = new EventEmitter<Product>();
}
