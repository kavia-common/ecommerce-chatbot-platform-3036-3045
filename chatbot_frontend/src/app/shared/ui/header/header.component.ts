import { Component, EventEmitter, Output } from '@angular/core';

// PUBLIC_INTERFACE
@Component({
  selector: 'app-header',
  standalone: true,
  template: `
  <header class="header">
    <div class="brand" (click)="home.emit()">
      <div class="logo">🛍️</div>
      <div class="title">OceanShop</div>
    </div>

    <div class="search">
      <input type="text" placeholder="Search products..." (keydown.enter)="onSearch($event)" />
    </div>

    <nav class="nav">
      <button class="btn secondary" (click)="openChat.emit()">Chat</button>
      <button class="btn primary" (click)="openCart.emit()">Cart</button>
    </nav>
  </header>
  `,
  styles: [`
  .header {
    position: sticky; top: 0; z-index: 50;
    display: grid; grid-template-columns: 1fr 2fr 1fr; gap: 1rem;
    align-items: center;
    padding: 0.75rem 1rem;
    background: linear-gradient(135deg, rgba(37,99,235,0.08), rgba(243,244,246,1));
    backdrop-filter: saturate(180%) blur(6px);
    border-bottom: 1px solid rgba(0,0,0,0.05);
  }
  .brand { display:flex; align-items:center; gap: .5rem; cursor:pointer; }
  .logo { font-size: 1.35rem; }
  .title { font-weight: 700; color:#111827; letter-spacing: .2px; }
  .search input {
    width: 100%; padding: .6rem .8rem;
    border-radius: .75rem; border: 1px solid rgba(0,0,0,0.08);
    outline: none; background: #fff;
    box-shadow: 0 1px 2px rgba(0,0,0,0.04);
    transition: box-shadow .2s ease, border-color .2s ease;
  }
  .search input:focus { border-color: #2563EB; box-shadow: 0 4px 14px rgba(37,99,235,.12); }
  .nav { display:flex; justify-content:flex-end; gap:.5rem; }
  .btn {
    padding: .55rem .9rem; border-radius: .75rem; border: 1px solid transparent;
    cursor: pointer; transition: transform .1s ease, box-shadow .2s ease, background .2s ease;
    font-weight: 600;
  }
  .btn:hover { transform: translateY(-1px); }
  .primary { background:#2563EB; color:#fff; box-shadow: 0 6px 18px rgba(37,99,235,.25); }
  .secondary { background:#F59E0B; color:#111827; box-shadow: 0 6px 18px rgba(245,158,11,.25); }
  @media (max-width: 768px) {
    .header { grid-template-columns: 1fr auto auto; }
    .search { display:none; }
  }
  `]
})
export class HeaderComponent {
  @Output() openCart = new EventEmitter<void>();
  @Output() openChat = new EventEmitter<void>();
  @Output() home = new EventEmitter<void>();

  onSearch(ev: Event) {
    const input = ev.target as HTMLInputElement | null;
    const q = input?.value?.trim?.() ?? '';
    if (typeof window !== 'undefined' && typeof CustomEvent !== 'undefined') {
      const event = new CustomEvent('app:search', { detail: q });
      window.dispatchEvent(event);
    }
  }
}
