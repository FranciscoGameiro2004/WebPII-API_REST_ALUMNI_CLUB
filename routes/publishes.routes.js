const express = require('express');
const router = express.Router();

// import controller middleware
const publishesController = require("../controllers/publishes.controller");

/*----------------Users----------------*/

// Rota ('/'))
router.route('/')
.get(publishesController.findAll)



router.all('*', (req, res) => {
res.status(404).json({ message: 'Error' }); //Mensagem genérica
})

//export this router
module.exports = router;