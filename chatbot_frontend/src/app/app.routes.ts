import { Routes } from '@angular/router';
import { AppShellComponent } from './layout/app-shell/app-shell.component';
import { HomeComponent } from './pages/home/home.component';
import { CheckoutPageComponent } from './features/checkout/checkout-page/checkout-page.component';
import { ConfirmationPageComponent } from './features/checkout/confirmation-page/confirmation-page.component';

export const routes: Routes = [
  {
    path: '',
    component: AppShellComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'checkout', component: CheckoutPageComponent },
      { path: 'checkout/confirmation', component: ConfirmationPageComponent },
    ],
  },
  { path: '**', redirectTo: '' },
];
