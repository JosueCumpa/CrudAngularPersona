type InitFn = (manifest?: string) => Promise<unknown>;
type BootstrapLoader = () => Promise<unknown>;

export async function startApp(
  initFn?: InitFn,
  loadBootstrap: BootstrapLoader = () => import('./bootstrap')
): Promise<void> {
  try {
    const init = initFn ?? (await import('@angular-architects/native-federation')).initFederation;
    await init('federation.manifest.json');
    await loadBootstrap();
  } catch (err) {
    console.error('Application failed to start:', err);
  }
}


declare const __karma__: unknown;
// istanbul ignore next
if (typeof __karma__ === 'undefined') {void startApp(); //NOSONAR
}
