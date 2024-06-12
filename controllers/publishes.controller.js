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
    const currentPage = req.query.page >= 0 ? req.query.page : 0;
    const limit = +req.query.limit;

    if (limit < 5 || !Number.isInteger(limit)) {
      throw new ErrorHandler(
        400,
        "Limit must be a positive integer, greater than 5"
      );
    }

    let publicationsList = await publications.findAndCountAll({
      attributes: ["id", "UserId", "title"],
      raw: true,
      limit: limit,
      offset: currentPage ? currentPage * limit : 0,
      where: {
         title: { [Op.like]: `%${req.query.search != undefined ? req.query.search : ''}%` },
        /* [Op.or]: 
        [
          { title: { [Op.like]: `%${req.query.search != undefined ? req.query.search : ''}%` } },
        ], */
      },
      include: [{model: db.users, attributes: ['username']}]
    });

    publicationsList.rows.forEach((publication, index) => {
      publicationsList.rows[index].links = [
        { rel: "self", href: `/publishes/${publication.id}`, method: "GET" },
      ];

      let userTarget = db.users.findOne({
        attributes: ['username'],
        raw: true,
        where: {
          id: publication.UserId
        }
      })
      publicationsList.rows[index].user = userTarget.username
      delete publicationsList.rows[index].UserId
    });

    if (publicationsList.rows.length < 1) {
      throw new ErrorHandler(404, "Page not found");
    }

    const numPages = Math.ceil(publicationsList.length / limit);

    links = [];

    if (currentPage > 0) {
      links.push({
        rel: "next-page",
        href: `/publishes?limit=${limit}&page=${currentPage - 1}`,
        method: "GET",
      });
    }
    if (currentPage < limit) {
      links.push({
        rel: "next-page",
        href: `/publishes?limit=${limit}&page=${currentPage + 1}`,
        method: "GET",
      });
    }

    res.status(200).json({
      pagination: {
        total: publicationsList.rows.length,
        pages: numPages,
        current: currentPage,
        limit: limit,
      },
      data: publicationsList.rows,
      links: links,
    });
  } catch (error) {
    next(error)
  }
};

exports.findOne = async (req, res, next) => {
  try {
    if(!req.params.id){
      throw new ErrorHandler(400, 'The id was not submitted')
    }
    if (isNaN(req.params.id) || Number.isInteger(req.params.id)) {
      throw new ErrorHandler(400, 'The id is not a lavid type')
    }

    let publication = await publications.findOne({
      attributes: ['title', 'body', 'UserId', 'dateTime' ,'id'],
      where: {
        id: req.params.id
      },
      raw:true,
      include: [{model: db.users, attributes: ['username', 'name']}]
    })

    if (publication == null){
      throw new ErrorHandler(404, 'Publication not found')
    }

    publication.user = publication["User.username"]
    publication.name = publication["User.name"]
    delete publication.user
    delete publication.name

    res.status(200).json(publication)
  } catch (error) {
    next(error)
  }
}

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
