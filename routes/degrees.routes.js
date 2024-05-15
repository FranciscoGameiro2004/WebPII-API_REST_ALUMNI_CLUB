const express = require('express');
const router = express.Router();

// import controller middleware
const degreesController = require("../controllers/degrees.controller");
const usersController = require("../controllers/users.controller");

/*----------------Users----------------*/

// Rota ('/'))
router.route('/')
.get(degreesController.findAll)
.post(usersController.isAdmin, degreesController.bodyValidator, degreesController.createInstitution)

// Rota ('/:usersID')
router.route('/:id')
.delete(usersController.isAdmin, degreesController.deleteInstitution)
.patch(usersController.isAdmin, degreesController.bodyValidator, degreesController.updateInstitution)

/*----------------Events---------------*/

router.all('*', (req, res) => {
res.status(404).json({ message: 'Error' }); //Mensagem genérica
})

//export this router
module.exports = router;