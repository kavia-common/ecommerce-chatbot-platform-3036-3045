import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, catchError, of, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CartItem, ChatRequest, ChatResponse, CheckoutRequest, CheckoutResponse, OrderSummary, Product } from '../models/product.model';

// PUBLIC_INTERFACE
@Injectable({ providedIn: 'root' })
export class ApiService {
  /** This is the base URL used for all backend API calls. Configure via NG_APP_API_BASE env var. */
  readonly baseUrl = environment.apiBaseUrl;
  private http = inject(HttpClient);

  // PUBLIC_INTERFACE
  /** Sends a chat message and returns the updated conversation. */
  chat(request: ChatRequest): Observable<ChatResponse> {
    return this.http.post(`${this.baseUrl}/chat`, request, { responseType: 'json' }) as Observable<ChatResponse>;
  }

  // PUBLIC_INTERFACE
  /** Retrieves a list of products. Supports basic query and pagination. */
  getProducts(query?: string, page = 1, pageSize = 20): Observable<Product[]> {
    let params = new HttpParams().set('page', page).set('pageSize', pageSize);
    if (query) params = params.set('q', query);
    return this.http.get(`${this.baseUrl}/products`, { params, responseType: 'json' }) as Observable<Product[]>;
  }

  // PUBLIC_INTERFACE
  /** Gets a product by id. */
  getProduct(id: string): Observable<Product> {
    return this.http.get(`${this.baseUrl}/products/${encodeURIComponent(id)}`, { responseType: 'json' }) as Observable<Product>;
  }

  // PUBLIC_INTERFACE
  /** Computes an order summary locally or via backend (placeholder uses local calc). */
  summarizeOrder(items: CartItem[], currency = 'USD'): Observable<OrderSummary> {
    // Local calculation placeholder; backend endpoint could be /checkout/summary
    const subtotal = items.reduce((acc, i) => acc + i.product.price * i.quantity, 0);
    const shipping = subtotal > 100 ? 0 : 7.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;
    return of({
      items,
      subtotal: round2(subtotal),
      shipping: round2(shipping),
      tax: round2(tax),
      total: round2(total),
      currency,
    });
  }

  // PUBLIC_INTERFACE
  /** Performs checkout; expects backend to return an order confirmation. */
  checkout(request: CheckoutRequest): Observable<CheckoutResponse> {
    return this.http.post(`${this.baseUrl}/checkout`, request, { responseType: 'json' }) as Observable<CheckoutResponse>;
  }

  private handleError<T>(op: string, error: HttpErrorResponse, fallback?: T): Observable<T> {
    console.error(`[ApiService:${op}]`, error);
    if (fallback !== undefined) {
      return of(fallback);
    }
    return throwError(() => error);
  }
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}
