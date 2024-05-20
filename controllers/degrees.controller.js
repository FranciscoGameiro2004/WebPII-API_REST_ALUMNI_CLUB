// import users data
const { where } = require("sequelize");

const db = require("../models/index.js");
let degrees = db.degrees
const { clear } = require("console");

// Routes /
exports.findAll = async (req, res) => {
    clear();console.log("Degrees---findAll")
    try {
      let degreeList = await degrees.findAll();
      res.status(200).json(degreeList)
    }
    catch (err) {
      res.status(500).send('Something went wrong. Please try again later')
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
        res.status(201).send('Degree created successfully!')
      }
      else {
        res.status(401).send('This degree already exists')
      }

    } 
    catch (err) {
      next(err)
    }
}

// Routes /:id
exports.deleteDegrees = async (req, res) => {
  clear();console.log("Degree---deleteDegree")
  let oneDegree = await degrees.findOne({where:{id:req.params.id}})
  degrees.delete(oneDegree)
}

exports.updateDegrees = async (req, res) => {
    clear();console.log("Degree---updateDegree")
    let oneDegree = await degrees.findOne({where:{id:req.params.id}})
    oneDegree.designation=req.body.designation
    oneDegree.save()
    res.status(200).json(oneDegree)
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