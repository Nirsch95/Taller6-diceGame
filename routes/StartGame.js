const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

/**
 * Método POST
 * Permite iniciar el juego.
 */
router.post('/', gameController.startGamePost);

module.exports = router;