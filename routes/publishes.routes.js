const express = require('express');
const router = express.Router();

// import controller middleware
const publishesController = require("../controllers/publishes.controller");
const authController = require("../controllers/auth.controller")

/*----------------Users----------------*/

// Rota ('/'))
router.route('/')
.get(publishesController.findAll)
.post(authController.verifyToken, publishesController.createPublication)

 router.route('/:id')
.get(publishesController.findOne)
.delete(authController.verifyToken, publishesController.deletePublication)

router.route('/:id/comments')
//.get(publishesController.getComments)
.post(authController.verifyToken, publishesController.addComment)

router.route('/:id/comments/:commentId')
.delete(authController.verifyToken, publishesController.removeComment)

router.all('*', (req, res) => {
res.status(404).json({ message: 'Error' }); //Mensagem genérica
})

//export this router
module.exports = router;