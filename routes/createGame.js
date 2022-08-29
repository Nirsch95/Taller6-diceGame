const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

/**
 * Método POST
 * Permite crear un juego.
 */
router.post('/', gameController.gameCreatePost);

module.exports = router;