const clear = require('clear');
const { ErrorHandler } = require("../utils/error.js");
const db = require("../models/index.js");
let degrees = db.degrees

const { Op, ValidationError, where, JSON } = require("sequelize");
const { raw } = require('mysql2');

// Routes //
exports.findAll = async (req, res, next) => {
    clear();console.log("Degrees---findAll")
    try {
      /* let degreeList = await degrees.findAll();
      return res.status(200).json(degreeList) */

    const currentPage = req.query.page >= 0 ? parseInt(req.query.page) : 0;
    const limit = parseInt(req.query.limit);

    if (limit < 1 || !Number.isInteger(limit)) {
      throw new ErrorHandler(400, "Limit must be a positive integer, greater than or equal to 5");
    }

    let degreeList = await degrees.findAndCountAll({
      attributes: ['id', 'designation', 'InstitutionId', 'DegreeTypeId'],
      raw: true,
      limit: limit,
      offset: currentPage * limit,
      where: {
        designation: {
          [Op.like]: `%${req.query.search || ''}%`
        }
      }
    });

    degreeList.rows.forEach((degree, index) => {
      degreeList.rows[index].links = [
        { rel: "self", href: `/degrees/${degree.id}`, method: "GET" },
      ];
      let degreeType
      if (degreeType == 1) {
        degreeType = 'Curso Técnico Superior'
      } else if (degreeType == 2){
        degreeType = 'Licenciatura'
      } else if (degreeType == 3){
        degreeType = 'Pós-Graduação'
      } else if (degreeType == 4){
        degreeType = 'Mestrado'
      } else if (degreeType == 5){
        degreeType = 'Doutoramento'
      }
      degreeList.rows[index].type = degreeType
      delete degreeList.rows[index].DegreeTypeId
    });

    const numPages = Math.ceil(degreeList.count / limit);

    let links = [];
    if (currentPage > 0) {
      links.push({
        rel: "prev-page",
        href: `/degrees?limit=${limit}&page=${currentPage - 1}`,
        method: "GET",
      });
    }
    if (currentPage < numPages - 1) {
      links.push({
        rel: "next-page",
        href: `/degrees?limit=${limit}&page=${currentPage + 1}`,
        method: "GET",
      });
    }

    res.status(200).json({
      pagination: {
        total: degreeList.count,
        pages: numPages,
        current: currentPage,
        limit: limit,
      },
      data: degreeList.rows,
      links: links,
    });
    }
    catch (err) {
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

exports.updateDegrees = async (req, res, next) => {
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

exports.deleteDegrees = async (req, res, next) => {
  clear();console.log("Degree---deleteDegree")
  try {
        let oneDegree = await degrees.findOne({where:{id:req.params.id}})
        oneDegree.destroy()
        return res.status(204).send('Degree successfully deleted')
  }
  catch (err) {
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