import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, shareReplay, switchMap, tap } from 'rxjs';
import { ApiService } from './api.service';
import { Product } from '../models/product.model';

// PUBLIC_INTERFACE
@Injectable({ providedIn: 'root' })
export class ProductService {
  private api = inject(ApiService);

  private query$ = new BehaviorSubject<string | undefined>(undefined);
  private products$ = this.query$.pipe(
    switchMap((q) => this.api.getProducts(q, 1, 100)),
    shareReplay(1)
  );

  // PUBLIC_INTERFACE
  /** Streams product list, refetching on search. */
  get products(): Observable<Product[]> {
    return this.products$;
  }

  // PUBLIC_INTERFACE
  /** Triggers a product search/filter. */
  search(query?: string) {
    this.query$.next(query);
  }

  // PUBLIC_INTERFACE
  /** Fetch a single product by id. */
  getProduct(id: string) {
    return this.api.getProduct(id);
  }
}
