// import institutions data
const clear = require('clear');
const { ErrorHandler } = require("../utils/error.js");
//let institutions = require("../models/institutions.model");

const db = require("../models/index.js");
let institutions = db.institutions;

const { Op, ValidationError, where, JSON } = require("sequelize");
const { raw } = require('mysql2');

exports.findAll = async (req, res) => {
  try {
    clear();console.log("Institutions---findAll")

    const currentPage = req.query.page >= 0 ? req.query.page : 0;
    const limit = +req.query.limit;

    if (limit < 5 || !Number.isInteger(limit)) {
      throw new ErrorHandler(
        400,
        "Limit must be a positive integer, greater than 5"
      );
    }

    let allInstitutions = await institutions.findAndCountAll({
      attributes: [ 'designation', 'address', 'logoUrl', 'url', 'email', 'phoneNumber'],
      raw: true,
      limit: limit,
      offset: currentPage? currentPage * limit : 0,
      where: {
        designation: { [Op.like]: `%${req.query.search != undefined ? req.query.search : ''}%`}
      }
    })

    allInstitutions.row.forEach((institution, index) => {
      allInstitutions.rows[index].links = [
        { rel: "self", href: `/institutions/${institution.id}`, method: "GET" },
      ];
    });

    
    if (allInstitutions.rows.length < 1) {
      throw new ErrorHandler(404, "Page not found");
    }

    const numPages = Math.ceil(allInstitutions.length / limit);

    links = [];

    if (currentPage > 0) {
      links.push({
        rel: "next-page",
        href: `/institution?limit=${limit}&page=${currentPage - 1}`,
        method: "GET",
      });
    }
    if (currentPage < limit) {
      links.push({
        rel: "next-page",
        href: `/institution?limit=${limit}&page=${currentPage + 1}`,
        method: "GET",
      });
    }

    res.status(200).json({
      pagination: {
        total: allInstitutions.rows.length,
        pages: numPages,
        current: currentPage,
        limit: limit,
      },
      data: allInstitutions.rows,
      links: links,
    });

    //res.json(allInstitutions)
  } 
  catch (err) {
    if (err instanceof ValidationError)
      err = new ErrorHandler(
        400,
        err.errors.map((e) => e.message)
      );
  }

}

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