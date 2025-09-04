const { Router } = require('express');
const router = Router();

/** Middleware: solo permite GET */
function onlyGet(req, res, next) {
  if (req.method !== 'GET') {
    return res.status(400).send('Invalid http request method');
  }
  next();
}

// Registrar a nivel de Router, antes de las rutas
router.use(onlyGet);

router.get('/', (req, res) => {
  res.send('Ruta clientes medium');
});

module.exports = router;
