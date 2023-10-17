const express = require('express');
const router = express.Router();
const { rateLimit } = require('express-rate-limit');
const userCtrl = require('../controllers/User');

const rateLimiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 1 hour
	limit: 5, 
	message: 'Too many accounts created from this IP, please try again after an hour',
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, 
})

router.post('/signup', rateLimiter, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;