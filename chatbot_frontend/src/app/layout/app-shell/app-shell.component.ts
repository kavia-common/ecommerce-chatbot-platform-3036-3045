import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

// PUBLIC_INTERFACE
@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterModule],
  template: `
  <div class="shell">
    <router-outlet></router-outlet>
  </div>
  `,
  styles: [`
  .shell {
    background: linear-gradient(180deg, rgba(37,99,235,0.06), rgba(249,250,251,1));
    min-height: 100vh;
  }
  `]
})
export class AppShellComponent {}
