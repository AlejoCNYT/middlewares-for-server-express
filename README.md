# Express Middleware Lab — Ada Cars (International / Internacional)

This repository implements two core **Express** middlewares for a customer listing server:

1. **Medium Clients**: accepts **only GET** requests; any other method must respond with **HTTP 400** and the **exact** body text: `Invalid http request method`.
2. **Premium Clients**: adds a response header **`url`** with the path from which the request was made (e.g., `/premium-clients`).

> ✅ Status: **All tests passing (6/6)** with the provided ADA test suite.

---

## Requirements / Requisitos

- Node.js 18+ (recommended / recomendado)
- npm 9+
- (Optional / Opcional) `curl` for manual checks / para pruebas manuales

---

## Setup & Run (EN)

```bash
# install dependencies
npm install

# ensure express is installed (if not already pulled by package.json)
npm i express

# run automated tests
npm run test

# start the server (if a start script is available)
npm start
```

## Configuración y Ejecución (ES)

```bash
# instalar dependencias
npm install

# asegurar que express esté instalado (si no viene en package.json)
npm i express

# ejecutar pruebas automáticas
npm run test

# iniciar el servidor (si existe script start)
npm start
```

---

## Routes & Expected Behavior (EN)

### `/medium-clients`
- **Allowed**: `GET`
- **Rejected**: `POST`, `PUT`, `PATCH`, `DELETE`, etc.
- **When method is NOT GET**: respond with **HTTP 400** and **exact body**: `Invalid http request method`

### `/premium-clients`
- Any `GET` should include a response header:
  - `url: /premium-clients` (or the mount path of this router)

## Rutas y Comportamiento (ES)

### `/medium-clients`
- **Permitido**: `GET`
- **Bloqueado**: `POST`, `PUT`, `PATCH`, `DELETE`, etc.
- **Cuando el método NO es GET**: responder con **HTTP 400** y **texto exacto**: `Invalid http request method`

### `/premium-clients`
- Cualquier `GET` debe incluir el header de respuesta:
  - `url: /premium-clients` (o la ruta donde se monta este router)

---

## Key Code / Código Clave

### `src/routers/medium-clients.js`
```js
const { Router } = require('express');
const router = Router();

/** Middleware: allow only GET / solo permite GET */
function onlyGet(req, res, next) {
  if (req.method !== 'GET') {
    return res.status(400).send('Invalid http request method');
  }
  next();
}

// Register at Router level, before route handlers / Registrar antes de las rutas
router.use(onlyGet);

router.get('/', (req, res) => {
  res.send('Medium clients route');
});

module.exports = router;
```

### `src/routers/premium-clients.js`
```js
const { Router } = require('express');
const router = Router();

/** Middleware: add 'url' response header with requested path / añade header 'url' */
function addRequestUrlHeader(req, res, next) {
  const requestUrl = req.baseUrl || req.originalUrl || req.url;
  res.header('url', requestUrl);
  next();
}

// Register at Router level, before route handlers / Registrar antes de las rutas
router.use(addRequestUrlHeader);

router.get('/', (req, res) => {
  res.send('Premium clients route');
});

module.exports = router;
```

> **Important / Importante:** Register middlewares **before** route handlers and do not remove existing handlers.  
> Registra los middlewares **antes** de las rutas y no borres handlers existentes.

---

## ADA Client (Submit/Start)

This repository includes ADA client binaries to fetch/submit the assignment. / Este repositorio incluye los binarios de ADA para obtener/enviar la asignación.

- **Windows (PowerShell):**
  ```powershell
  .\ada-client.exe start "<YOUR_ASSIGNMENT_URL>"
  .\ada-client.exe submit "<YOUR_ASSIGNMENT_URL>"
  ```
- **Linux:**
  ```bash
  ./ada-client-linux start "<YOUR_ASSIGNMENT_URL>"
  ./ada-client-linux submit "<YOUR_ASSIGNMENT_URL>"
  ```
- **macOS:**
  ```bash
  ./ada-client start "<YOUR_ASSIGNMENT_URL>"
  ./ada-client submit "<YOUR_ASSIGNMENT_URL>"
  ```

Run local tests / Ejecutar pruebas locales:
```bash
npm run test
```

---

## Manual Verification (curl) / Verificación Manual (curl)

With the server running at `http://localhost:3000` / Con el servidor en `http://localhost:3000`:

```bash
# EN — medium-clients: POST must fail with 400 + exact text
# ES — medium-clients: POST debe fallar con 400 + texto exacto
curl -i -X POST http://localhost:3000/medium-clients
# Expected / Esperado:
# HTTP/1.1 400 Bad Request
# ...
# Invalid http request method

# EN — premium-clients: must include 'url' header
# ES — premium-clients: debe incluir el header 'url'
curl -i http://localhost:3000/premium-clients
# Expected header / Header esperado:
# url: /premium-clients
```

---

## Project Structure (reference) / Estructura del Proyecto (referencial)

```
.
├─ src/
│  ├─ index.js                # App/server bootstrap & routers mount / Configuración de app/servidor y montaje de routers
│  └─ routers/
│     ├─ medium-clients.js    # Allow only GET / Solo GET
│     └─ premium-clients.js   # Add 'url' header / Añade header 'url'
├─ package.json
├─ package-lock.json
├─ ada-client*                # ADA binaries (Windows/macOS/Linux) / binarios ADA
└─ node_modules/              # ignored by git / ignorado por git
```

---

## Notes / Notas

- Status code and message must match tests **exactly** / El código y el texto deben coincidir **exactamente** con las pruebas:
  - `Invalid http request method` (no extra punctuation or casing / sin puntuación ni mayúsculas extra).
  - Status **400** for invalid methods on `/medium-clients` / **400** para métodos inválidos en `/medium-clients`.
- To compute the path for the premium header, prefer `req.baseUrl` (fallbacks: `req.originalUrl`, `req.url`).  
  Para el header de premium, usa `req.baseUrl` (respaldo: `req.originalUrl`, `req.url`).

---

## Troubleshooting (GitHub / Network) / Solución de Problemas (GitHub / Red)

- For `HTTP 408` or `Could not resolve host: github.com` during `git push`:
- Para `HTTP 408` o `Could not resolve host: github.com` al hacer `git push`:
  1. Flush DNS (Windows): `ipconfig /flushdns`
  2. Remove Git proxies / Quitar proxies de Git:
     ```bash
     git config --global --unset http.proxy
     git config --global --unset https.proxy
     ```
  3. Check connectivity / Verificar conectividad: `git ls-remote origin`
  4. If needed, switch to **SSH** / Si es necesario, cambiar a **SSH**:
     ```bash
     ssh-keygen -t ed25519 -C "your_email"
     # Add public key in GitHub → Settings → SSH and GPG keys / Agrega la clave pública en GitHub
     git remote set-url origin git@github.com:YOUR_USER/YOUR_REPO.git
     git push -u origin main
     ```

---

## License / Licencia

Academic / educational use. / Uso académico/educativo.
