// import users data
let degrees = require("../models/degrees.model");

// Routes /
exports.findAll = (req, res) => {

}

exports.createInstitution = (req, res) => {

}

// Routes /:id
exports.deleteInstitution = (req, res) => {

}

exports.updateInstitution = (req, res) => {

}

// Middlewares
exports.bodyValidator = (req, res, next) => {
    if(!isRegistered(req) && req.method=='POST') {
      console.log("POST")
      next();
    }
    else {
      res.json("user already exists")
    }
  }