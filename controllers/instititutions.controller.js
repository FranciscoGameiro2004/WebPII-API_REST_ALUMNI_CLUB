// import institutions data
const clear = require('clear');
const { ErrorHandler } = require("../utils/error.js");
const db = require("../models/index.js");
let institutions = db.institutions;

const { Op, ValidationError, where, JSON } = require("sequelize");
const { raw } = require('mysql2');

exports.findAll = async (req, res, next) => {
  try {
    clear();
    console.log("Institutions---findAll");

    const currentPage = req.query.page >= 0 ? parseInt(req.query.page) : 0;
    const limit = parseInt(req.query.limit);

    if (limit < 1 || !Number.isInteger(limit)) {
      throw new ErrorHandler(400, "Limit must be a positive integer, greater than or equal to 5");
    }

    let allInstitutions = await institutions.findAndCountAll({
      attributes: ['id', 'designation', 'address', 'logoUrl', 'url', 'email', 'phoneNumber'],
      raw: true,
      limit: limit,
      offset: currentPage * limit,
      where: {
        designation: {
          [Op.like]: `%${req.query.search || ''}%`
        }
      }
    });

    allInstitutions.rows.forEach((institution, index) => {
      allInstitutions.rows[index].links = [
        { rel: "self", href: `/institutions/${institution.id}`, method: "GET" },
      ];
    });

    const numPages = Math.ceil(allInstitutions.count / limit);

    let links = [];
    if (currentPage > 0) {
      links.push({
        rel: "prev-page",
        href: `/institutions?limit=${limit}&page=${currentPage - 1}`,
        method: "GET",
      });
    }
    if (currentPage < numPages - 1) {
      links.push({
        rel: "next-page",
        href: `/institutions?limit=${limit}&page=${currentPage + 1}`,
        method: "GET",
      });
    }

    res.status(200).json({
      pagination: {
        total: allInstitutions.count,
        pages: numPages,
        current: currentPage,
        limit: limit,
      },
      data: allInstitutions.rows,
      links: links,
    });
  } catch (err) {
    next(err);
  }
};

exports.findOne = async (req, res) => {
  try {
    clear();console.log("Institutions---findOne")
    let oneInstititution = await institutions.findOne({ where: {id: req.params.id}});//console.log(oneInstititution);
    res.json(oneInstititution)
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

exports.createInstitution = async (req, res,next) => {
  clear();console.log("Institutions---createInstitution")
  //res.json(req.body)
  try {

    if (
      !req.body.designation ||
      !req.body.address ||
      !req.body.zipCode ||
      !req.body.url ||
      !req.body.email ||
      !req.body.phone ||
      !req.body.logoUrl
    ) {
      throw new ErrorHandler(400, "There is a lack of required information to register an HEI.");
    }

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
    .status(204).json('')
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