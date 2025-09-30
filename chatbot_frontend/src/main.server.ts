import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';

/**
 * Server bootstrap for SSR. Must return Promise<ApplicationRef>.
 */
const bootstrap = () => bootstrapApplication(AppComponent, config);

export default bootstrap;
