import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../core/models/product.model';

// PUBLIC_INTERFACE
@Component({
  selector: 'app-product-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="overlay" (click)="close.emit()">
    <div class="modal" (click)="$event.stopPropagation()">
      <button class="close" (click)="close.emit()">✕</button>
      <div class="content">
        <div class="image">
          <img [src]="product?.imageUrl" [alt]="product?.title" />
        </div>
        <div class="details">
          <h3>{{ product?.title }}</h3>
          <div class="price">{{ product?.price | currency:product?.currency }}</div>
          <p class="desc">{{ product?.description }}</p>
          <div class="actions">
            <button class="btn primary" (click)="addToCart.emit(product)">Add to cart</button>
            <button class="btn ghost" (click)="close.emit()">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  `,
  styles: [`
  .overlay {
    position: fixed; inset: 0; background: rgba(17,24,39,0.45);
    display:flex; align-items: center; justify-content: center;
    padding: 1rem; z-index: 60;
  }
  .modal {
    width: 100%; max-width: 900px; border-radius: 1rem; background:#fff;
    box-shadow: 0 24px 60px rgba(0,0,0,0.25);
    border: 1px solid rgba(0,0,0,0.06);
    position: relative; overflow: hidden;
  }
  .close {
    position: absolute; top:.5rem; right:.5rem; border:none; background: transparent; cursor: pointer;
    font-size: 1.25rem; padding:.5rem; border-radius:.5rem;
  }
  .content { display:grid; grid-template-columns: 1fr 1fr; gap: 1rem; padding: 1rem; }
  .image { background:#f3f4f6; border-radius:.75rem; display:flex; align-items:center; justify-content:center; }
  .image img { width: 100%; height: 100%; object-fit: contain; }
  .details h3 { margin-bottom:.25rem; color:#111827; }
  .price { color:#2563EB; font-weight: 800; margin-bottom: .5rem; }
  .desc { color:#374151; line-height: 1.5; }
  .actions { display:flex; gap:.5rem; margin-top: 1rem; }
  .btn { padding:.6rem .9rem; border-radius:.75rem; border:1px solid transparent; font-weight:700; cursor:pointer; }
  .btn.primary { background:#2563EB; color:#fff; }
  .btn.ghost { background:#ffffff; border-color: rgba(0,0,0,0.08); }
  @media (max-width: 768px) {
    .content { grid-template-columns: 1fr; }
  }
  `]
})
export class ProductModalComponent {
  @Input() product!: Product | undefined;
  @Output() close = new EventEmitter<void>();
  @Output() addToCart = new EventEmitter<Product | undefined>();
}
