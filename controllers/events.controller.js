// import users data
let events = require("../models/events.model");

//-----------------------------------------------//
//-------------Comandos apiRest------------------//
//-----------------------------------------------//

//GET/events | Obs:Content-Length: false
exports.findAll = (req, res) => {
  console.log("findAll");console.table(events)
  res.json(events);
};



/*
exports.findEventsId = (req, res) => {
  console.log("findEventId");//console.table(events)
  let event = events.filter(user => user.id == req.params.id)[0]
  res.json(event)
}

exports.findEventsParticipants = (req, res) => {
  console.log("findEventsParticipants");//console.table(events)
  let event = events.filter(user => user.id == req.params.id)[0]
  res.json(event.attendees);console.table(event.attendees)
}
*/

//Funções de apoio
exports.bodyValidator = (req, res, next) => {
  if(!isRegistered(req) && req.method=='POST') {
    console.log("POST")
    next();
  }
  else {
    res.json("event already exists")
  }
}
