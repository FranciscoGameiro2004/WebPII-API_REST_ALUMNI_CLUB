// import users data
const { where } = require("sequelize");

const db = require("../models/index.js");
let degrees = db.degrees
const { clear } = require("console");
const { ErrorHandler } = require("../utils/error.js");

// Routes /
exports.findAll = async (req, res) => {
    clear();console.log("Degrees---findAll")
    try {
      let degreeList = await degrees.findAll();
      return res.status(200).json(degreeList)
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

exports.createDegrees = async (req, res, next) => {
    clear();console.log("Degrees---createDegrees");
    try {
      let degreeList = await degrees.findAll({
        where: {
          designation:req.body.designation
        }
      });

      if (degreeList.length==0) {
        console.log("Degrees---condição concluida")
        let degree = await degrees.create({
          designation: req.body.designation,
          InstitutionId: req.body.institutionId,
          DegreeTypeId: req.body.degreeType
        })
        return res.status(201).send('Degree created successfully!')
      }
      else {
        throw new ErrorHandler(401,'This degree already exists')
      }

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

// Routes /:id
exports.deleteDegrees = async (req, res) => {
  clear();console.log("Degree---deleteDegree")
  try {
        let oneDegree = await degrees.findOne({where:{id:req.params.id}})
        oneDegree.destroy()
        return res.status(204).send('Degree successfully deleted')
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

exports.updateDegrees = async (req, res) => {
    clear();console.log("Degree---updateDegree")
    try {
          let oneDegree = await degrees.findOne({where:{id:req.params.id}})
          oneDegree.designation=req.body.designation
          oneDegree.save()
          res.status(200).json(oneDegree)
    }
    catch(err) {
      if (err instanceof ValidationError)
        err = new ErrorHandler(
          400,
          err.errors.map((e) => e.message)
        );
      next(err);
    }
    
}

// Middlewares
exports.bodyValidator = (req, res, next) => {
    /* if(!isRegistered(req) && req.method=='POST') {
      console.log("POST")
      next();
    }
    else {
      res.json("user already exists")
    } */
    next()
  }