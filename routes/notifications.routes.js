const express = require('express');
const router = express.Router();

const notificationsController = require('../controllers/notifications.controller')
const authenticationController = require("../controllers/auth.controller");

router.route('/')
.get(authenticationController.verifyToken, notificationsController.getAllUserNotifs)

router.route('/:id')
.patch(authenticationController.verifyToken, notificationsController.checkNotificationAsRead)

module.exports = router;