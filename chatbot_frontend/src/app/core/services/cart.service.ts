import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem, Product } from '../models/product.model';

// PUBLIC_INTERFACE
@Injectable({ providedIn: 'root' })
export class CartService {
  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  // PUBLIC_INTERFACE
  /** Observable of current cart items. */
  readonly items$ = this.itemsSubject.asObservable();

  // PUBLIC_INTERFACE
  /** Adds a product to the cart or increases quantity if already present. */
  add(product: Product, qty = 1) {
    const items = [...this.itemsSubject.value];
    const idx = items.findIndex(i => i.product.id === product.id);
    if (idx >= 0) {
      items[idx] = { ...items[idx], quantity: items[idx].quantity + qty };
    } else {
      items.push({ product, quantity: qty });
    }
    this.itemsSubject.next(items);
  }

  // PUBLIC_INTERFACE
  /** Updates quantity for an item; removes if quantity <= 0. */
  updateQuantity(productId: string, qty: number) {
    let items = [...this.itemsSubject.value];
    const idx = items.findIndex(i => i.product.id === productId);
    if (idx >= 0) {
      if (qty <= 0) {
        items.splice(idx, 1);
      } else {
        items[idx] = { ...items[idx], quantity: qty };
      }
      this.itemsSubject.next(items);
    }
  }

  // PUBLIC_INTERFACE
  /** Removes a product from the cart. */
  remove(productId: string) {
    const items = this.itemsSubject.value.filter(i => i.product.id !== productId);
    this.itemsSubject.next(items);
  }

  // PUBLIC_INTERFACE
  /** Clears the cart. */
  clear() {
    this.itemsSubject.next([]);
  }

  // PUBLIC_INTERFACE
  /** Synchronous snapshot of items for calculations. */
  get snapshot(): CartItem[] {
    return this.itemsSubject.value;
  }
}
