const express = require('express');
const router = express.Router();

// import controller middleware
const institutionsController = require("../controllers/instititutions.controller");
const authenticationController = require("../controllers/auth.controller");
// Rota ('/'))
router.route('/')
.get(institutionsController.findAll)
//.post(authenticationController.verifyToken,authenticationController.isAdmin,institutionsController.createInstitution)

.post(institutionsController.createInstitution)

// Rota(/:id)
router.route('/:id')
.get(institutionsController.findOne)
.put(authenticationController.verifyToken,authenticationController.isAdmin,institutionsController.updateInstitution)
.delete(authenticationController.verifyToken,authenticationController.isAdmin,institutionsController.deleteInstitution)

router.all('*', (req, res) => {
res.status(404).json({ message: 'Error' }); //Mensagem genérica
})

//export this router
module.exports = router;