const express = require('express');
const router = express.Router();
const controller = require('../controllers/tutorController');
const authenticate = require('../middleware/auth');

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', authenticate, controller.create);
router.put('/:id', authenticate, controller.update);
router.delete('/:id', authenticate, controller.remove);

module.exports = router;
