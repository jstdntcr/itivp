const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const { me } = require('../controllers/authController');

router.get('/', authenticate, me);

module.exports = router;
