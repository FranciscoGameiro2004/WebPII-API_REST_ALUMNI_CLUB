// import events data
const clear = require('clear');
const { ErrorHandler } = require("../utils/error.js");
//let events = require("../models/events.model");

const db = require("../models/index.js");
let events = db.events;

const { Op, ValidationError, where, JSON } = require("sequelize");

  /* querry filtro
  const currentPage = req.query.page >= 0 ? req.query.page : 0;
  const limit = +req.query.limit;

  if (limit < 5 || !Number.isInteger(limit)) {
    throw new ErrorHandler(
      400,
      "Limit must be a positive integer, greater than 5"
    );
  }
  */

exports.findAll = async (req, res) => {
  console.log("findAll");console.table(events)
  let allEvents = await events.findAll()
  res.json(allEvents);
};

exports.findOne = async (req, res) => {
  try {
    clear();console.log("Events---findOne")
    let oneEvent = await events.findOne({ where: {id: req.params.id}});//console.log(oneInstititution);
    res.json(oneEvent)
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

exports.updateEvent = async (req, res) => {
  try {
    clear();console.log("Event---updateEvent")
    let oneEvent = await events.findOne({ where: {id: req.params.id}})
    oneEvent.name=req.body.name;//console.log(oneEvent.name)
    oneEvent.date=req.body.date;//console.log(oneEvent.date)
    oneEvent.startTime=req.body.startTime;//console.log(oneEvent.startTime)
    oneEvent.endTime=req.body.endTime;//console.log(oneEvent.endTime)
    await oneEvent.save()
  
    return res
    .status(201)
    .json({ success: true, msg: "Event was updated successfully!" });
  } 
  catch (err) {
    if (err instanceof ValidationError) {
      err = new ErrorHandler(
        400,
        err.errors.map((e) => e.message)
      );
    }
  }
}

exports.deleteEvent = async (req, res) => {
  try {
    clear();console.log("Event---deleteEvent")
    let oneEvent = await events.findOne({ where: {id: req.params.id}})
    oneEvent.destroy();
  
    return res
    .status(201)
    .json({ success: true, msg: "Event was deleted successfully!" });
  }
  catch (err) {
    if (err instanceof ValidationError) {
      err = new ErrorHandler(
        400,
        err.errors.map((e) => e.message)
      );
    }
  }
}




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
