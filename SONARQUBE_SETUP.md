# Configuración de SonarQube para el Proyecto

## 📋 Resumen

SonarQube analiza la calidad del código. El token de autenticación **NO debe estar hardcodeado** en el repositorio por razones de seguridad.

## 🔐 Configuración del Token

### Opción 1: En tu máquina local (Desarrollo)

**Windows (PowerShell):**
```powershell
$env:SONAR_TOKEN='tu_token_aqui'
npm run sonar
```

**Windows (CMD):**
```cmd
set SONAR_TOKEN=tu_token_aqui
npm run sonar
```

**Linux/Mac:**
```bash
export SONAR_TOKEN='tu_token_aqui'
npm run sonar
```

### Opción 2: En CI/CD (GitHub Actions, GitLab CI, etc.)

Configura la variable de entorno `SONAR_TOKEN` en los secretos de tu plataforma.

**GitHub Actions - Ejemplo:**
```yaml
- name: Run SonarQube Scan
  env:
    SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
  run: npx sonar-scanner
```

### Opción 3: Crear archivo `.env.local` (SOLO para desarrollo, NO subir a Git)

```
SONAR_TOKEN=tu_token_aqui
```

Luego en el package.json:
```json
"scripts": {
  "sonar": "set SONAR_TOKEN=your_token && npx sonar-scanner"
}
```

## 🚀 Cómo obtener tu token

1. Accede a SonarQube: `http://127.0.0.1:9000`
2. Ve a **My Account** (Tu Cuenta)
3. Selecciona la pestaña **Security** (Seguridad)
4. Crea un nuevo token: **Generate Tokens**
5. Copia el token generado

## 📝 Ejecutar análisis

Una vez configurada la variable de entorno:

```bash
npm run sonar
```

O directamente:
```bash
npx sonar-scanner
```

## ⚠️ Seguridad

- **NUNCA** commits tokens en el código
- **NUNCA** subas archivos `.env` con tokens
- Usa variables de entorno o secretos de CI/CD
- Revoca el token si fue expuesto: SonarQube > My Account > Security > Revoke

## 📂 Archivos relacionados

- `sonar-project.properties` - Configuración del proyecto SonarQube
- `package.json` - Scripts de npm

## 🔗 Referencias

- [SonarQube - Documentation](https://docs.sonarqube.org/)
- [SonarQube - Token Authentication](https://docs.sonarqube.org/latest/user-guide/user-account/generating-and-using-tokens/)

