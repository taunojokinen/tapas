const express = require('express');
const { getUserList } = require('../controllers/userController');

const router = express.Router();

router.get('/list', getUserList); // Get user list route

module.exports = router;