const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController')

/**
 * GET página principal. 
 */
router.get('/', gameController.indexGet);

/**
 * GET página createGame
 */
router.get('/createGame', gameController.gameCreateGet);

/**
 * GET página startGame.
 */
router.get('/startGame', gameController.startGameGet);

module.exports = router;