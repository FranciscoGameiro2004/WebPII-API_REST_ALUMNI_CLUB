const clear = require('clear');

const db = require("../models/index.js");
let institutions = db.institutions;
const { ErrorHandler } = require("../utils/error.js");
const { Op, ValidationError, where, JSON } = require("sequelize");

exports.findAll = async (req, res) => {
  try {
    clear();console.log("Institutions---findAll")
    let allInstitutions = await institutions.findAll();
    res.json(allInstitutions)
  } 
  catch (error) {
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
    clear();console.log("Institutions---findOne")
    let oneInstititution = await institutions.findOne({ where: {id: req.params.id}});//console.log(oneInstititution);
    res.json(oneInstititution)
  } 
  catch (error) {
    
  }
}

exports.createInstitution = async (req, res,next) => {
  clear();console.log("Institutions---createInstitution")
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
      //! Criar e 'encher' o modelo dos zipCodes
      console.log("Institutions---condição concluida")
      let instititution = await institutions.create({
        designation: req.body.designation,
        email: req.body.email,
        address: req.body.address,
        // ZipCodeZipCode: req.body.zipCode,
        url: req.body.url,
        phoneNumber: req.body.phone,
        logoUrl: req.body.logoUrl

      });
    } else {
      clear();console.log("401, An institution is already registered.");
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

exports.updateInstitution = async (req, res) => {
  try {
    clear();console.log("Institution---updateInstitution")
    let oneInstititution = await institutions.findOne({ where: {id: req.params.id}})
    oneInstititution.designation=req.body.designation; console.log(oneInstititution.designation)
    await oneInstititution.save()
  
    return res
    .status(201)
    .json({ success: true, msg: "Institution was updated successfully!" });
  } 
  catch (error) {
    if (err instanceof ValidationError)
      err = new ErrorHandler(
        400,
        err.errors.map((e) => e.message)
      );
    next(err);
  }
}

exports.deleteInstitution = async (req, res) => {
  try {
    clear();console.log("Institution---deleteInstitution")
    let oneInstititution = await institutions.findOne({ where: {id: req.params.id}})
    oneInstititution.destroy();
  
    return res
    .status(201)
    .json({ success: true, msg: "Institution was deleted successfully!" });
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