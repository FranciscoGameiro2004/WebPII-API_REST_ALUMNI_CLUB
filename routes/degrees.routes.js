const express = require('express');
const router = express.Router();

// import controller middleware
const degreesController = require("../controllers/degrees.controller");
const authController = require("../controllers/auth.controller")

/*----------------Users----------------*/

// Rota ('/'))
router.route('/')
.get(degreesController.findAll)
.post(authController.verifyToken, authController.isAdmin, degreesController.bodyValidator, degreesController.createDegrees)

// Rota ('/:usersID')
router.route('/:id')
.delete(authController.isAdmin, degreesController.deleteDegrees)
.patch(authController.verifyToken, authController.isAdmin, degreesController.bodyValidator, degreesController.updateDegrees)

/*----------------Events---------------*/

router.all('*', (req, res) => {
res.status(404).json({ message: 'Error' }); //Mensagem genérica
})

//export this router
module.exports = router;