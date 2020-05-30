const express = require('express');
const { register, login, getMe } = require('../Controllers/auth');

const User = require('../Models/User');
const advancedResults = require('../Middleware/advancedResults');

const router = express.Router();

const { protect } = require('../Middleware/auth');

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/me').get(protect, getMe);

module.exports = router;
