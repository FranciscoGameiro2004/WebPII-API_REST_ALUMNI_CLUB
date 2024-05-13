const express = require('express');
const router = express.Router();

// import controller middleware
const usersController = require("../controllers/users.controller");

/*----------------Users----------------*/

// Rota ('/'))
router.route('/')
.get(usersController.findAll)
.post(usersController.bodyValidator, usersController.createUser)

// Rota ('/:usersID')
router.route('/:id')
.get(usersController.findUserId)

/*----------------Events---------------*/

router.all('*', (req, res) => {
res.status(404).json({ message: 'Error' }); //Mensagem genérica
})

//export this router
module.exports = router;