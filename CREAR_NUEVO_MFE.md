# Guía: Crear un Nuevo Micro Frontend en MFE Workspace V2

## Flujo Completo de Comandos

### Paso 1: Generar la Aplicación Angular
```powershell
ng generate application nombre-mfe
```
**Ejemplo:**
```powershell
ng generate application pedidos
```

Esto creará la estructura básica en `projects/pedidos/`

---

### Paso 2: Crear la Estructura del Componente

Crea las carpetas y archivos dentro de `projects/nombre-mfe/src/app/`:

```
projects/nombre-mfe/
├── src/
│   └── app/
│       └── nombre-componente/
│           ├── nombre-componente.component.ts
│           ├── nombre-componente.component.html
│           ├── nombre-componente.component.scss
│           └── index.ts
```

**Ejemplo para "pedidos":**
```powershell
# Crear la carpeta
mkdir projects/pedidos/src/app/pedidos-list

# Los archivos se crearán en el siguiente paso
```

---

### Paso 3: Crear los Archivos del Componente

#### `nombre-componente.component.ts`
```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-nombre-componente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './nombre-componente.component.html',
  styleUrl: './nombre-componente.component.scss'
})
export class NombreComponenteComponent implements OnInit {
  
  constructor() {}

  ngOnInit(): void {
    console.log('Componente de Nombre cargado');
  }
}
```

#### `nombre-componente.component.html`
```html
<div class="contenedor">
  <h2>Título del Módulo</h2>
  <p>Contenido aquí</p>
</div>
```

#### `nombre-componente.component.scss`
```scss
.contenedor {
  padding: 20px;
  max-width: 900px;
  margin: 0 auto;

  h2 {
    color: #333;
    border-bottom: 3px solid #007bff;
    padding-bottom: 10px;
    margin-bottom: 20px;
  }
}
```

#### `index.ts` (Barrel Export)
```typescript
export * from './nombre-componente.component';
```

---

### Paso 4: Crear Configuración de Federación

#### `projects/nombre-mfe/federation.config.js`
```javascript
// projects/nombre-mfe/federation.config.js
const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({
  name: 'nombre-mfe',
  exposes: {
    './NombreComponente': './projects/nombre-mfe/src/app/nombre-componente/index.ts',
  },
  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },
});
```

---

### Paso 5: Actualizar TypeScript Configs

#### `projects/nombre-mfe/tsconfig.app.json`
```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "../../out-tsc/app",
    "types": []
  },
  "include": [
    "src/**/*.ts"
  ],
  "exclude": [
    "src/**/*.spec.ts"
  ]
}
```

#### `projects/nombre-mfe/tsconfig.federation.json`
```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "../../out-tsc/app",
    "types": []
  },
  "include": [
    "src/**/*.ts"
  ],
  "exclude": [
    "src/**/*.spec.ts"
  ]
}
```

---

### Paso 6: Actualizar `angular.json`

Agregar la configuración del nuevo MFE después de "productos":

```json
"nombre-mfe": {
  "projectType": "application",
  "schematics": {
    "@schematics/angular:component": {
      "style": "scss"
    }
  },
  "root": "projects/nombre-mfe",
  "sourceRoot": "projects/nombre-mfe/src",
  "prefix": "app",
  "architect": {
    "build": {
      "builder": "@angular-architects/native-federation:build",
      "options": {},
      "configurations": {
        "production": {
          "target": "nombre-mfe:esbuild:production"
        },
        "development": {
          "target": "nombre-mfe:esbuild:development",
          "dev": true
        }
      },
      "defaultConfiguration": "production"
    },
    "serve": {
      "builder": "@angular-architects/native-federation:build",
      "options": {
        "target": "nombre-mfe:serve-original:development",
        "rebuildDelay": 500,
        "dev": true,
        "cacheExternalArtifacts": false,
        "port": 0
      }
    },
    "extract-i18n": {
      "builder": "@angular-devkit/build-angular:extract-i18n"
    },
    "esbuild": {
      "builder": "@angular/build:application",
      "options": {
        "outputPath": "dist/nombre-mfe",
        "index": "projects/nombre-mfe/src/index.html",
        "browser": "projects/nombre-mfe/src/main.ts",
        "polyfills": [
          "zone.js",
          "es-module-shims"
        ],
        "tsConfig": "projects/nombre-mfe/tsconfig.app.json",
        "inlineStyleLanguage": "scss",
        "assets": [
          {
            "glob": "**/*",
            "input": "projects/nombre-mfe/public"
          }
        ],
        "styles": [
          "projects/nombre-mfe/src/styles.scss"
        ],
        "scripts": []
      },
      "configurations": {
        "production": {
          "budgets": [
            {
              "type": "initial",
              "maximumWarning": "500kB",
              "maximumError": "1MB"
            },
            {
              "type": "anyComponentStyle",
              "maximumWarning": "2kB",
              "maximumError": "4kB"
            }
          ],
          "outputHashing": "all"
        },
        "development": {
          "optimization": false,
          "extractLicenses": false,
          "sourceMap": true
        }
      },
      "defaultConfiguration": "production"
    },
    "serve-original": {
      "builder": "@angular-devkit/build-angular:dev-server",
      "configurations": {
        "production": {
          "buildTarget": "nombre-mfe:esbuild:production"
        },
        "development": {
          "buildTarget": "nombre-mfe:esbuild:development"
        }
      },
      "defaultConfiguration": "development",
      "options": {
        "port": 4204
      }
    },
    "test": {
      "builder": "@angular-devkit/build-angular:karma",
      "options": {
        "polyfills": [
          "zone.js",
          "zone.js/testing"
        ],
        "tsConfig": "projects/nombre-mfe/tsconfig.spec.json",
        "inlineStyleLanguage": "scss",
        "assets": [
          {
            "glob": "**/*",
            "input": "projects/nombre-mfe/public"
          }
        ],
        "styles": [
          "projects/nombre-mfe/src/styles.scss"
        ],
        "scripts": []
      }
    }
  }
}
```

**IMPORTANTE:** Cambiar el puerto en `serve-original` > `options` > `port`:
- Shell: 4200
- Personas: 4202
- Productos: 4203
- Nuevo MFE: 4204 (o el siguiente disponible)

---

### Paso 7: Actualizar Manifest del Shell

Archivo: `projects/shell/public/federation.manifest.json`

```json
{
  "personas": "http://localhost:4202/remoteEntry.json",
  "productos": "http://localhost:4203/remoteEntry.json",
  "nombre-mfe": "http://localhost:4204/remoteEntry.json"
}
```

---

### Paso 8: Agregar Ruta en el Shell

Archivo: `projects/shell/src/app/app.routes.ts`

```typescript
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
  {
    path: 'nombre-ruta',
    loadComponent: () =>
      loadRemoteModule({
        remoteName: 'nombre-mfe',
        exposedModule: './NombreComponente',
      }).then((m) => m.NombreComponenteComponent),
  },
];
```

---

### Paso 9: Limpiar y Ejecutar

```powershell
# Limpiar build anterior
rm -r dist

# Terminal 1: Ejecutar el nuevo MFE
ng serve nombre-mfe

# Terminal 2: Ejecutar personas
ng serve personas

# Terminal 3: Ejecutar productos
ng serve productos

# Terminal 4: Ejecutar shell
ng serve shell
```

---

## Ejemplo Completo: Crear MFE "Pedidos"

### 1. Generar aplicación
```powershell
ng generate application pedidos
```

### 2. Crear estructura
```powershell
mkdir projects/pedidos/src/app/pedidos-list
```

### 3. Crear `federation.config.js` en `projects/pedidos/`
```javascript
const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({
  name: 'pedidos',
  exposes: {
    './PedidosListComponent': './projects/pedidos/src/app/pedidos-list/index.ts',
  },
  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },
});
```

### 4. Crear componente en `projects/pedidos/src/app/pedidos-list/pedidos-list.component.ts`
```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pedidos-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pedidos-list.component.html',
  styleUrl: './pedidos-list.component.scss'
})
export class PedidosListComponent implements OnInit {
  ngOnInit(): void {
    console.log('Módulo de Pedidos cargado');
  }
}
```

### 5. Crear `index.ts` en `projects/pedidos/src/app/pedidos-list/`
```typescript
export * from './pedidos-list.component';
```

### 6. Actualizar `tsconfig.app.json` y `tsconfig.federation.json` (excluir .spec.ts)

### 7. Agregar en `angular.json` con puerto 4204

### 8. Actualizar manifest: agregar `"pedidos": "http://localhost:4204/remoteEntry.json"`

### 9. Agregar ruta en `app.routes.ts`

### 10. Ejecutar
```powershell
ng serve pedidos
ng serve shell
```

---

## Checklist Rápido

- [ ] `ng generate application nombre-mfe`
- [ ] Crear estructura: `projects/nombre-mfe/src/app/componente-list/`
- [ ] Crear `.component.ts`, `.component.html`, `.component.scss`, `index.ts`
- [ ] Crear `federation.config.js`
- [ ] Actualizar `tsconfig.app.json` y `tsconfig.federation.json` (include/exclude)
- [ ] Agregar configuración en `angular.json` (con nuevo puerto)
- [ ] Actualizar `federation.manifest.json` en shell
- [ ] Agregar ruta en `app.routes.ts` del shell
- [ ] `rm -r dist`
- [ ] `ng serve nombre-mfe`

¡Listo! El nuevo MFE estará disponible en `http://localhost:4200/ruta-del-mfe`
