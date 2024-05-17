const express = require('express');
const router = express.Router();

// import controller middleware
const institutionsController = require("../controllers/instititutions.controller");
const usersController = require("../controllers/users.controller");

// Rota ('/'))
router.route('/')
.get(institutionsController.findAll)
.post(institutionsController.createInstitution)
//.post(usersController.isAdmin)
//.post(usersController.isAdmin, institutionsController.bodyValidator)
//.post(usersController.isAdmin, institutionsController.bodyValidator, institutionsController.createInstitution)

// Rota(/:id)
router.route('/:id')
.put(institutionsController.updateInstitution)

router.all('*', (req, res) => {
res.status(404).json({ message: 'Error' }); //Mensagem genérica
})

//export this router
module.exports = router;