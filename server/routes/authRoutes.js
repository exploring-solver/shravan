const express = require('express');
const { register, login, authMiddleware } = require('../controllers/authControllers');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: `Welcome, ${req.user.email}` });
});

module.exports = router;
