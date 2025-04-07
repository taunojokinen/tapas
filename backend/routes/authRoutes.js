const express = require('express');
const { login, logout, getLoggedInUsers, changePassword } = require('../controllers/authController');

const router = express.Router();

router.post('/login', login); // Login route
router.post('/logout', logout); // Logout route
router.get('/logged-in-users', getLoggedInUsers); // Route to fetch logged-in users
router.post('/change-password', changePassword); // Add the change password route

module.exports = router;