// import events data
const clear = require('clear');
const { ErrorHandler } = require("../utils/error.js");
//let events = require("../models/events.model");

const db = require("../models/index.js");
let events = db.events;

const { Op, ValidationError, where, JSON } = require("sequelize");
exports.findAll = (req, res) => {
  console.log("findAll");console.table(events)
  res.json(events);
};

exports.createEvent = async (req, res,next) => {
  clear();console.log("events---createEvent")
  //res.json(req.body)
  try {
    let eventList = await events.findAll({
      where: {
        name: req.body.name
      },
    });

    if (eventList.length == 0) {
      //! Criar e 'encher' o modelo dos zipCodes
      console.log("Events---condição concluida")
      let event = await events.create({
        name: req.body.name,
        date: req.body.date,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
      });
    } else {
      clear();console.log("401, An event is already registered.");
      throw new ErrorHandler(401, "An event is already registered.");
    }

    return res
      .status(201)
      .json({ success: true, msg: "event was registered successfully!" });
  } 
  catch (err) {
    if (err instanceof ValidationError)
      err = new ErrorHandler(
        400,
        err.errors.map((e) => e.message)
      );
    next(err);
  }
}


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
