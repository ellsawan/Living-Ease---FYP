// routes/authRoutes.js
const express = require('express');
const { getNotificationsByUser} = require('../controllers/notificationController');

const router = express.Router();
// Route to get notifications for a specific user (tenant or landlord)
router.get('/notifications/:userId', getNotificationsByUser);

module.exports = router;
