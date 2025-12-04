import { Type } from '@angular/core';
import { routes } from './app.routes';
import {
  MockPersonasComponent,
  MockProductosComponent,
  initFederation,
} from '../testing/native-federation.mock';

describe('app.routes loadComponent', () => {
  it('should load Personas component', async () => {
    const loadComponent = routes[1].loadComponent as () => Promise<Type<unknown>>;
    const result = await loadComponent();

    expect(result).toBe(MockPersonasComponent);
  });

  it('should load Productos component', async () => {
    const loadComponent = routes[2].loadComponent as () => Promise<Type<unknown>>;
    const result = await loadComponent();

    expect(result).toBe(MockProductosComponent);
  });

  it('should initialize federation mock without errors', async () => {
    await expectAsync(initFederation('federation.manifest.json')).toBeResolved();
  });
});
