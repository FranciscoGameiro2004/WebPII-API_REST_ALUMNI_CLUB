// import users data
const db = require("../models/index.js");
let publications = db.publications
let comment = db.comment
const { clear } = require("console");
const { Op, ValidationError, where, JSON } = require("sequelize");
const { ErrorHandler } = require("../utils/error.js");
const { title } = require("process");

//-----------------------------------------------//
//-------------Comandos apiRest------------------//
//-----------------------------------------------//

//GET/publishes | Obs:Content-Length: false
exports.findAll = async (req, res, next) => {
  try {
    
  } catch (error) {
    
  }
};

exports.createPublication = async (req, res, next) => {
  try {
    if (!req.body.title || !req.body.body){
      throw new ErrorHandler(400, 'This post does not have any content.')
    }

    let publication = await publications.create({
      UserId: req.loggedUserId,
      title: req.body.title,
      body: req.body.body
    })

    res.status(200).json({message: 'The publication was succesfully posted!'})
  } catch (error) {
    next(error)
  }
}


exports.deletePublication = async (req, res, next) => {
  try {
    if(!req.params.id){
      throw new ErrorHandler(400, 'The id was not submitted')
    }
    if (isNaN(req.params.id) || Number.isInteger(req.params.id)) {
      throw new ErrorHandler(400, 'The id is not a lavid type')
    }

    let publication = await publications.findOne({
      attributes: ['id', 'UserId'],
      where: {
        id: req.params.id
      }
    })

    if (publication == null){
      throw new ErrorHandler(404, 'Publication not found')
    }

    if (!(publication.UserId == req.loggedUserId) && req.loggedUserType != 'admin'){
      throw new ErrorHandler(403, 'You must had published the post or being an admin to delete it.')
    };

    publication.destroy()
    return res.status(200).send({message: 'Publication successfully deleted'})
    
  } catch (error) {
    next(error)
  }
}

//Funções de apoio
exports.bodyValidator = async (req, res, next) => {
  if(!isRegistered(req) && req.method=='POST') {
    console.log("POST")
    next();
  }
  else {
    res.json("event already exists")
  }
}
