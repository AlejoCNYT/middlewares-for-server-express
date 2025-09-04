const { Router } = require('express');
const router = Router();

/** Middleware: añade header 'url' con la ruta solicitada */
function addRequestUrlHeader(req, res, next) {
  // En routers, baseUrl es el path donde se monta: /premium-clients
  const requestUrl = req.baseUrl || req.originalUrl || req.url;
  res.header('url', requestUrl);
  next();
}

// Registrar a nivel de Router, antes de las rutas
router.use(addRequestUrlHeader);

router.get('/', (req, res) => {
  res.send('Ruta clientes premium');
});

module.exports = router;
