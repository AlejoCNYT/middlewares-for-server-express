# Express Middleware Lab — Ada Cars (International)

This repository implements two core **Express** middlewares for a customer listing server:

1. **Medium Clients**: accepts **only GET** requests; any other method must respond with **HTTP 400** and the **exact** body text: `Invalid http request method`.
2. **Premium Clients**: adds a response header **`url`** with the path from which the request was made (e.g., `/premium-clients`).

> ✅ Status: **All tests passing (6/6)** with the provided ADA test suite.

---

## Requirements

- Node.js 18+ (recommended)
- npm 9+
- (Optional) `curl` for manual checks

---

## Setup & Run

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

---

## Routes & Expected Behavior

### `/medium-clients`
- **Allowed**: `GET`
- **Rejected**: `POST`, `PUT`, `PATCH`, `DELETE`, etc.
- **When method is NOT GET**: respond with **HTTP 400** and **exact body**: `Invalid http request method`

### `/premium-clients`
- Any `GET` should include a response header:
  - `url: /premium-clients` (or the mount path of this router)

---

## Key Code (Middlewares)

### `src/routers/medium-clients.js`
```js
const { Router } = require('express');
const router = Router();

/** Middleware: allow only GET requests */
function onlyGet(req, res, next) {
  if (req.method !== 'GET') {
    return res.status(400).send('Invalid http request method');
  }
  next();
}

// Register at Router level, before route handlers
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

/** Middleware: add 'url' response header with the requested path */
function addRequestUrlHeader(req, res, next) {
  const requestUrl = req.baseUrl || req.originalUrl || req.url;
  res.header('url', requestUrl);
  next();
}

// Register at Router level, before route handlers
router.use(addRequestUrlHeader);

router.get('/', (req, res) => {
  res.send('Premium clients route');
});

module.exports = router;
```

> **Important:** Register the middlewares **before** the route handlers. Do not remove existing handlers.

---

## ADA Client (Submit/Start)

This repository includes ADA client binaries to fetch/submit the assignment.

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

Run local tests with:
```bash
npm run test
```

---

## Manual Verification (curl)

With the server running at `http://localhost:3000`:

```bash
# 1) medium-clients: POST must fail with 400 + exact text
curl -i -X POST http://localhost:3000/medium-clients
# Expected:
# HTTP/1.1 400 Bad Request
# ...
# Invalid http request method

# 2) premium-clients: must include the 'url' header
curl -i http://localhost:3000/premium-clients
# Expected header:
# url: /premium-clients
```

---

## Project Structure (reference)

```
.
├─ src/
│  ├─ index.js                # App/server bootstrap & routers mount
│  └─ routers/
│     ├─ medium-clients.js    # Middleware: allow only GET
│     └─ premium-clients.js   # Middleware: add 'url' header
├─ package.json
├─ package-lock.json
├─ ada-client*                # ADA binaries (Windows/macOS/Linux)
└─ node_modules/              # ignored by git
```

---

## Notes

- Status code and message must match the tests **exactly**:
  - Body text: `Invalid http request method` (no extra punctuation or casing).
  - Status **400** for invalid methods on `/medium-clients`.
- To compute the path for the premium header, prefer `req.baseUrl` (fallbacks: `req.originalUrl`, `req.url`).

---

## Troubleshooting (GitHub / Network)

- For `HTTP 408` or `Could not resolve host: github.com` during `git push`:
  1. Flush DNS (Windows): `ipconfig /flushdns`
  2. Remove Git proxies:
     ```bash
     git config --global --unset http.proxy
     git config --global --unset https.proxy
     ```
  3. Check connectivity: `git ls-remote origin`
  4. If needed, switch to **SSH**:
     ```bash
     ssh-keygen -t ed25519 -C "your_email"
     # Add the public key in GitHub → Settings → SSH and GPG keys
     git remote set-url origin git@github.com:YOUR_USER/YOUR_REPO.git
     git push -u origin main
     ```

---

## License

Academic / educational use.
