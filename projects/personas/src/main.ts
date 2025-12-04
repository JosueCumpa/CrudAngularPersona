/* istanbul ignore file */
import { initFederation } from '@angular-architects/native-federation';

async function initApp(): Promise<void> {
  try {
    await initFederation();
    await import('./bootstrap');
  } catch (err) {
    console.error('Application failed to start:', err);
  }
}

initApp(); //NOSONAR
