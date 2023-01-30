const express = require('express');
const rateLimit = require('express-rate-limit');

const router = express.Router();

const password = require('../middleware/password');

const userCtrl = require('../controllers/user');

//Limiter le débit de connexion
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 10,
	standardHeaders: true,
	legacyHeaders: false,
})

//Les routes nécessaires à l'authentification
router.post('/signup', password, userCtrl.signup);
router.post('/login', limiter, userCtrl.login);

module.exports = router;