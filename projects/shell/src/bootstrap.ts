
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

type BootstrapFn = (
  component: typeof AppComponent,
  config: typeof appConfig
) => Promise<unknown>;

export async function bootstrapApp(
  bootstrapFn: BootstrapFn = bootstrapApplication
): Promise<void> {
  try {
    await bootstrapFn(AppComponent, appConfig);
  } catch (err) {
    console.error('Application failed to start:', err);
  }
}


declare const __karma__: unknown;
// istanbul ignore next
if (typeof __karma__ === 'undefined' && typeof document !== 'undefined' && document.querySelector('app-root')) { void bootstrapApp(); //NOSONAR
}
