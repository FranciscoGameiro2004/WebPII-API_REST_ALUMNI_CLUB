const express = require('express');
const router = express.Router();

// import controller middleware
const eventsController = require("../controllers/events.controller");

/*----------------Users----------------*/

// Rota ('/'))
router.route('/')
.get(eventsController.findAll)
.post(eventsController.createEvent);

// Rota ('/:eventID')
router.route('/:id')
//.get(eventsController.findEventsId)

// Rota ('/:eventID')
router.route('/:id/participants')
//.get(eventsController.findEventsParticipants)

router.all('*', (req, res) => {
res.status(404).json({ message: 'Error' }); //Mensagem genérica
})

//export this router
module.exports = router;