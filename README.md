# Middlewares para Servidor Express — Ada Cars

Laboratorio de **middlewares** para un servidor en **Express** que lista clientes por categorías. Este repo implementa dos middlewares clave:

1. **Medium Clients**: solo acepta solicitudes **GET**; cualquier otro método responde `400` con el texto exacto `Invalid http request method`.
2. **Premium Clients**: añade el header de respuesta `url` con la ruta solicitada (por ejemplo, `/premium-clients`).

> ✅ Estado: **6/6 tests en verde** con los tests provistos por ADA.

---

## Requisitos

- Node.js 18+ (recomendado)
- npm 9+
- (Opcional) `curl` para pruebas manuales

---

## Instalación y ejecución

```bash
# instalar dependencias
npm install

# (solo si no está instalado)
npm i express

# ejecutar pruebas automáticas
npm run test

# arrancar el servidor (si hay script start)
npm start
```

---

## Rutas y comportamiento

### `/medium-clients`
- **Permitido**: `GET`
- **Bloqueado**: `POST`, `PUT`, `PATCH`, `DELETE`, etc.
- **Respuesta cuando NO es GET**: `400` y body: `Invalid http request method`

### `/premium-clients`
- **Cualquier GET** devuelve respuesta normal **incluyendo** el header:
  - `url: /premium-clients` (o el path donde esté montado el router)

---

## Código clave (Middlewares)

### `src/routers/medium-clients.js`
```js
const { Router } = require('express');
const router = Router();

/** Middleware: solo permite GET */
function onlyGet(req, res, next) {
  if (req.method !== 'GET') {
    return res.status(400).send('Invalid http request method');
  }
  next();
}

// Registrar a nivel del Router, antes de las rutas
router.use(onlyGet);

router.get('/', (req, res) => {
  res.send('Ruta clientes medium');
});

module.exports = router;
```

### `src/routers/premium-clients.js`
```js
const { Router } = require('express');
const router = Router();

/** Middleware: añade header 'url' con la ruta solicitada */
function addRequestUrlHeader(req, res, next) {
  const requestUrl = req.baseUrl || req.originalUrl || req.url;
  res.header('url', requestUrl);
  next();
}

// Registrar a nivel del Router, antes de las rutas
router.use(addRequestUrlHeader);

router.get('/', (req, res) => {
  res.send('Ruta clientes premium');
});

module.exports = router;
```

> **Importante:** registra los middlewares **antes** de las rutas y no borres handlers existentes.

---

## Pruebas automáticas (ADA)

Este repo incluye los binarios de `ada-client` para enviar la solución:

- **Windows (PowerShell)**:
  ```powershell
  .\ada-client.exe start "<URL_DE_TU_ASIGNACIÓN>"
  .\ada-client.exe submit "<URL_DE_TU_ASIGNACIÓN>"
  ```
- **Linux**:
  ```bash
  ./ada-client-linux start "<URL_DE_TU_ASIGNACIÓN>"
  ./ada-client-linux submit "<URL_DE_TU_ASIGNACIÓN>"
  ```
- **macOS**:
  ```bash
  ./ada-client start "<URL_DE_TU_ASIGNACIÓN>"
  ./ada-client submit "<URL_DE_TU_ASIGNACIÓN>"
  ```

Ejecuta los tests locales con:
```bash
npm run test
```

---

## Verificación manual (curl)

Con el server levantado en `http://localhost:3000`:

```bash
# 1) medium-clients: un POST debe fallar con 400 + texto exacto
curl -i -X POST http://localhost:3000/medium-clients
# Esperado:
# HTTP/1.1 400 Bad Request
# ...
# Invalid http request method

# 2) premium-clients: debe incluir el header 'url'
curl -i http://localhost:3000/premium-clients
# Esperado (dentro de headers):
# url: /premium-clients
```

---

## Estructura del proyecto (referencial)

```
.
├─ src/
│  ├─ index.js                # Configuración de app/servidor y montaje de routers
│  └─ routers/
│     ├─ medium-clients.js    # Middleware: solo GET
│     └─ premium-clients.js   # Middleware: header 'url'
├─ package.json
├─ package-lock.json
├─ ada-client*                # binarios ADA (Windows/macOS/Linux)
└─ node_modules/              # ignorado por git
```

---

## Notas importantes

- Los mensajes y status deben coincidir **exactamente** con lo que esperan las pruebas:
  - `Invalid http request method` (sin puntos ni mayúsculas extra).
  - Status **400** para métodos inválidos en `/medium-clients`.
- Para obtener la ruta en el middleware de premium, usa `req.baseUrl` (o `req.originalUrl` / `req.url` como respaldo).

---

## Troubleshooting (GitHub / red)

- Si ves **HTTP 408** o **Could not resolve host: github.com** al hacer `git push`:
  1. Limpia DNS: `ipconfig /flushdns` (Windows).
  2. Revisa proxy:
     ```bash
     git config --global --unset http.proxy
     git config --global --unset https.proxy
     ```
  3. Prueba `git ls-remote origin` para verificar conectividad.
  4. Si persiste, cambia a **SSH**:
     ```bash
     ssh-keygen -t ed25519 -C "tu_email"
     # agrega la clave pública en GitHub → Settings → SSH and GPG keys
     git remote set-url origin git@github.com:TU_USUARIO/NOMBRE_REPO.git
     git push -u origin main
     ```

---

## Licencia

Uso académico/educativo.
