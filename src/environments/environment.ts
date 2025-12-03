export const environment = {
  production: false,
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  apiPersonasUrl: import.meta.env.VITE_API_PERSONAS_URL || 'http://localhost:8080/api/personas',
  apiProductosUrl: import.meta.env.VITE_API_PRODUCTOS_URL || 'http://localhost:8080/api/productos',
  ports: {
    shell: import.meta.env.VITE_SHELL_PORT || 4200,
    personas: import.meta.env.VITE_PERSONAS_PORT || 4202,
    productos: import.meta.env.VITE_PRODUCTOS_PORT || 4203,
  },
  appName: import.meta.env.VITE_APP_NAME || 'MFE Workspace',
  appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
};
