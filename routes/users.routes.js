const express = require('express');
const router = express.Router();

// import controller middleware
const usersController = require("../controllers/users.controller");
const authController = require("../controllers/auth.controller");

/*----------------Users----------------*/

// Rota ('/'))
router.route('/')
.get(usersController.findAll)
.post(usersController.bodyValidator, usersController.createUser)
.delete(authController.verifyToken, usersController.deleteAccount)

router.route('/login')
.post(usersController.bodyValidator, usersController.login)

router.route('/me')
.patch(authController.verifyToken, usersController.bodyValidator, usersController.updateAlumni)

// Rota ('/:usersID' or /me or /login)
router.route('/:id')
.get(usersController.findUserId)
.patch(authController.verifyToken, usersController.bodyValidator, usersController.updateAccount)

router.route('/:id/followers')
.post(authController.verifyToken, usersController.followUser)
.delete(authController.verifyToken, usersController.unfollowUser)

/*----------------Events---------------*/

router.all('*', (req, res) => {
res.status(404).json({ message: 'Error' }); //Mensagem genérica
})

//export this router
module.exports = router;