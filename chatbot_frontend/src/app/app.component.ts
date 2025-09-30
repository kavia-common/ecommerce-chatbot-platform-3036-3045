import { Component, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  template: `<router-outlet></router-outlet>`,
  styles: [``]
})
export class AppComponent implements OnDestroy {
  private navHandler = (ev: Event) => {
    // @ts-ignore
    const path = (ev as CustomEvent<string>).detail as string;
    if (path) this.router.navigateByUrl(path);
  };

  constructor(private router: Router) {
    if (typeof window !== 'undefined') {
      window.addEventListener('app:navigate', this.navHandler as any);
    }
  }

  ngOnDestroy(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('app:navigate', this.navHandler as any);
    }
  }
}
