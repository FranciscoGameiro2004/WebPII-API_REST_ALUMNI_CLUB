// import events data
const clear = require('clear');
const { ErrorHandler } = require("../utils/error.js");
//let events = require("../models/events.model");

const db = require("../models/index.js");
let events = db.events;
let eventsDate = db.eventDate;
let eventsFollowing = db.eventFollowing
let eventsParticipant = db.eventParticipant

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
  console.log("findAll")
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
        description: req.body.description,
        /* date: req.body.date,
        startTime: req.body.startTime,
        endTime: req.body.endTime, */
      });
      console.log(`New event id: ${event.id}`);
      const dates = req.body.dates

      for (day of dates){
        await eventsDate.create({
          EventId: event.id,
          date: day.date,
          startTime: day.startTime,
          endTime: day.endTime
        })
      }
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

exports.updateEvent = async (req, res, next) => {
  try {
    if (!req.params.id){
      throw new ErrorHandler(400, 'You need to leave every required part filled.')
    }

    let addedAttributes = { dates: [], participants: [] };
    let removeAttributes = { dates: [], participants: [] };

    if (
      !req.body.name &&
      !req.body.description &&
      !req.body.addDates &&
      !req.body.removeDates &&
      !req.body.addParticipants &&
      !req.body.removeParticipants
    ) {
      throw new ErrorHandler(400, "Please provide any change needed");
    }

    clear();console.log("Event---updateEvent")
    let oneEvent = await events.findOne({ where: {id: req.params.id}})
    oneEvent.name=req.body.name != undefined ? req.body.name : oneEvent.name;//console.log(oneEvent.name)
    oneEvent.name=req.body.description != undefined ? req.body.description : oneEvent.description;//console.log(oneEvent.description)
    /* oneEvent.date=req.body.date != undefined ? req.body.date : oneEvent.date;//console.log(oneEvent.date)
    oneEvent.startTime=req.body.startTime != undefined ? req.body.startTime : oneEvent.startTime;//console.log(oneEvent.startTime)
    oneEvent.endTime=req.body.endTime != undefined ? req.body.endTime : oneEvent.endTime;//console.log(oneEvent.endTime) */
    await oneEvent.save()

    if (req.body.removeDates.length > 0) {
      removeAttributes.dates = req.body.removeDates;
      removeAttributes.dates.forEach(async (day) => {
        await eventsDate.destroy({
          where: {EventId: req.params.id, date: day.date, startTime: day.startTime, endTime: day.endTime },
        });
      });
    }

    if (req.body.addDates.length > 0) {
      addedAttributes.dates = req.body.addDates
      addedAttributes.dates.forEach(async (day) => {
        await eventsDate.create({
          EventId: req.params.id,
          date: day.date,
          startTime: day.startTime,
          endTime: day.endTime
        })
      });
    }

    //! ATUALIZAR UTILIZADORES PARTICIPANTES!

  
    return res
    .status(201)
    .json({ success: true, msg: "Event was updated successfully!" });
  } 
  catch (err) {
    next(err)
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