import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/ui/header/header.component';
import { ProductListComponent } from '../../features/products/product-list/product-list.component';
import { CartDrawerComponent } from '../../features/cart/cart-drawer/cart-drawer.component';
import { ChatPanelComponent } from '../../features/chat/chat-panel/chat-panel.component';
import { RouterModule } from '@angular/router';

// PUBLIC_INTERFACE
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HeaderComponent, ProductListComponent, CartDrawerComponent, ChatPanelComponent, RouterModule],
  template: `
  <div class="app">
    <app-header (openCart)="toggleCart(true)" (openChat)="toggleChat(true)" (home)="goHome()"></app-header>
    <main class="main">
      <aside class="sidebar">
        <div class="card hero">
          <h3>Welcome to OceanShop</h3>
          <p>Discover products with our AI assistant. Ask for recommendations, compare items, and checkout seamlessly.</p>
          <button class="btn secondary" (click)="toggleChat(true)">Ask the assistant</button>
        </div>
        <div class="card info">
          <h4>Perks</h4>
          <ul>
            <li>Free shipping over $100</li>
            <li>30-day returns</li>
            <li>Secure payments</li>
          </ul>
        </div>
      </aside>
      <section class="content">
        <app-product-list></app-product-list>
      </section>
    </main>

    <app-cart-drawer *ngIf="showCart" (close)="toggleCart(false)" (proceed)="goCheckout()"></app-cart-drawer>
    <app-chat-panel *ngIf="showChat"></app-chat-panel>
  </div>
  `,
  styles: [`
  .app { min-height: 100vh; background: #f9fafb; }
  .main { display:grid; grid-template-columns: 320px 1fr; gap: 1rem; padding: 1rem; }
  .sidebar { display:flex; flex-direction:column; gap: 1rem; }
  .card { background:#fff; border-radius: 1rem; border:1px solid rgba(0,0,0,0.06); box-shadow: 0 8px 24px rgba(0,0,0,0.06); padding: 1rem; }
  .hero h3 { margin-bottom:.25rem; }
  .hero p { color:#4b5563; margin-bottom:.75rem; }
  .btn.secondary { background:#F59E0B; color:#111827; border:none; padding:.6rem .9rem; border-radius:.75rem; font-weight:700; cursor:pointer; }
  @media (max-width: 1024px) {
    .main { grid-template-columns: 1fr; }
    .sidebar { order: 2; }
    .content { order: 1; }
  }
  `]
})
export class HomeComponent {
  showCart = false;
  showChat = false;

  toggleCart(v: boolean) { this.showCart = v; }
  toggleChat(v: boolean) { this.showChat = v; }

  goHome() {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  goCheckout() {
    if (typeof window !== 'undefined' && typeof CustomEvent !== 'undefined') {
      window.dispatchEvent(new CustomEvent('app:navigate', { detail: '/checkout' }));
    }
  }
}
