/* istanbul ignore file */
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

async function bootstrapApp(): Promise<void> {
  try {
    await bootstrapApplication(AppComponent, appConfig);
  } catch (err) {
    console.error('Application failed to start:', err);
  }
}

bootstrapApp(); //NOSONAR
