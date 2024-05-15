const express = require('express');
const router = express.Router();

// import controller middleware
const institutionsController = require("../controllers/institutions.controller");
const usersController = require("../controllers/users.controller");

/*----------------Users----------------*/

// Rota ('/'))
router.route('/')
.get(institutionsController.findAll)
.post(usersController.isAdmin, institutionsController.bodyValidator, institutionsController.createInstitution)

// Rota ('/:usersID')
router.route('/:id')
.delete(usersController.isAdmin, institutionsController.deleteInstitution)
.patch(usersController.isAdmin, institutionsController.bodyValidator, institutionsController.updateInstitution)

/*----------------Events---------------*/

router.all('*', (req, res) => {
res.status(404).json({ message: 'Error' }); //Mensagem genérica
})

//export this router
module.exports = router;