import { Type } from '@angular/core';

export class MockPersonasComponent {
  static readonly __mock = true;
}

export class MockProductosComponent {
  static readonly __mock = true;
}

export function initFederation(_manifest?: string): Promise<void> {
  return Promise.resolve();
}

export function loadRemoteModule<TModule = unknown>(_config: unknown): Promise<TModule> {
  return Promise.resolve({
    PersonasCrudComponent: MockPersonasComponent as unknown as Type<unknown>,
    ProductosListComponent: MockProductosComponent as unknown as Type<unknown>,
  } as unknown as TModule);
}
