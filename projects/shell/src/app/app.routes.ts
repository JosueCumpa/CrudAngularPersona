// projects/shell/src/app/app.routes.ts
import { Type } from '@angular/core';
import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';

export const routes: Routes = [
  { path: '', redirectTo: 'personas', pathMatch: 'full' },
  {
    path: 'personas',
    loadComponent: (): Promise<Type<unknown>> =>
      loadRemoteModule<{ PersonasCrudComponent: Type<unknown> }>({
        remoteName: 'personas',
        exposedModule: './PersonasCrudComponent',
      }).then((m) => m.PersonasCrudComponent),
  },
  {
    path: 'productos',
    loadComponent: (): Promise<Type<unknown>> =>
      loadRemoteModule<{ ProductosListComponent: Type<unknown> }>({
        remoteName: 'productos',
        exposedModule: './ProductosListComponent',
      }).then((m) => m.ProductosListComponent),
  },
];
