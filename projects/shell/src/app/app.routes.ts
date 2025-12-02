// projects/shell/src/app/app.routes.ts
import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';

export const routes: Routes = [
  { path: '', redirectTo: 'personas', pathMatch: 'full' },
  {
    path: 'personas',
    loadComponent: () =>
      loadRemoteModule({
        remoteName: 'personas',
        exposedModule: './PersonasCrudComponent',
      }).then((m) => m.PersonasCrudComponent),
  },
  {
    path: 'productos',
    loadComponent: () =>
      loadRemoteModule({
        remoteName: 'productos',
        exposedModule: './ProductosListComponent',
      }).then((m) => m.ProductosListComponent),
  },
];
