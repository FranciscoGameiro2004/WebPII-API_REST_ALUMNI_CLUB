// import institutions data
const clear = require('clear');
const { ErrorHandler } = require("../utils/error.js");
//let institutions = require("../models/institutions.model");

const db = require("../models/index.js");
let institutions = db.institutions;

const { Op, ValidationError, where, JSON } = require("sequelize");

//-----------------------------------------------//
//-------------Comandos apiRest------------------//
//-----------------------------------------------//

exports.findAll = async (req, res) => {
  clear()
  console.log("Institutions---findAll")
  let allInstitutions = await institutions.findAll();
  res.json(allInstitutions)
}

exports.createInstitution = async (req, res,next) => {
  clear();
  console.log("Institutions---createInstitution")
  //res.json(req.body)

  try {
    let institutionList = await institutions.findAll({
      where: {
        designation: req.body.designation
      },
    });

    let emailList = await institutions.findAll({
      where: {
        email: req.body.email,
      },
    });

    if (institutionList.length == 0 && emailList.length == 0) {
      console.log("Institutions---condição concluida")
      let instititution = await institutions.create({
        designation: req.body.designation,
        email: req.body.email
      });
    } else {
      clear()
      throw new ErrorHandler(401, "An institution is already registered.");
    }

    return res
      .status(201)
      .json({ success: true, msg: "Institution was registered successfully!" });
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

exports.updateInstitution = (req, res) => {
  
}

exports.deleteInstitution = (req, res) => {

}

exports.bodyValidator = (req, res, next) => {
    if(!isRegistered(req) && req.method=='POST') {
      console.log("POST")
      next();
    }
    else {
      res.json("user already exists")
    }
}