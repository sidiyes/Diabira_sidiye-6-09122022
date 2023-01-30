const express = require('express');
const rateLimit = require('express-rate-limit');

const router = express.Router();

const password = require('../middleware/password');

const userCtrl = require('../controllers/user');

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 10,
	standardHeaders: true,
	legacyHeaders: false,
})

router.post('/signup', password, userCtrl.signup);
router.post('/login', limiter, userCtrl.login);

module.exports = router;