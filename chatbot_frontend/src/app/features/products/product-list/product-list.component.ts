import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../core/services/product.service';
import { ProductCardComponent } from '../../../shared/ui/product-card/product-card.component';
import { Product } from '../../../core/models/product.model';
import { CartService } from '../../../core/services/cart.service';
import { ProductModalComponent } from '../product-modal/product-modal.component';

// PUBLIC_INTERFACE
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, ProductModalComponent],
  template: `
  <div class="list">
    <div class="grid">
      <app-product-card
        *ngFor="let p of products"
        [product]="p"
        (addToCart)="add(p)"
        (view)="openDetails(p)"
      />
    </div>
  </div>

  <app-product-modal
    *ngIf="selected"
    [product]="selected"
    (close)="selected = undefined"
    (addToCart)="add(selected!)"
  />
  `,
  styles: [`
  .list { padding: 1rem; }
  .grid {
    display:grid; gap: 1rem;
    grid-template-columns: repeat(4, minmax(0,1fr));
  }
  @media (max-width: 1200px) { .grid { grid-template-columns: repeat(3, minmax(0,1fr)); } }
  @media (max-width: 900px) { .grid { grid-template-columns: repeat(2, minmax(0,1fr)); } }
  @media (max-width: 600px) { .grid { grid-template-columns: repeat(1, minmax(0,1fr)); } }
  `]
})
export class ProductListComponent implements OnInit, OnDestroy {
  private productService = inject(ProductService);
  private cart = inject(CartService);

  products: Product[] = [];
  selected?: Product;

  private searchListener = (ev: Event) => {
    const ce = ev as CustomEvent<string | undefined>;
    const q = ce.detail;
    this.productService.search(q);
  };

  ngOnInit(): void {
    this.productService.products.subscribe(p => this.products = p);
    if (typeof window !== 'undefined') {
      window.addEventListener('app:search', this.searchListener as any);
    }
  }

  ngOnDestroy(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('app:search', this.searchListener as any);
    }
  }

  add(p: Product) {
    this.cart.add(p, 1);
  }

  openDetails(p: Product) {
    this.selected = p;
  }
}
