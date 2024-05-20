const jwt = require("jsonwebtoken"); //JWT tokens creation (sign())
const bcrypt = require("bcryptjs"); //password encryption

const JWTconfig = require("../config/jwt.config.js");
const { ErrorHandler } = require("../utils/error.js");

// import users data
const db = require("../models/index.js");
let users = db.users;
let alumniJob = db.alumniJob;
let alumniDegree = db.alumniDegree;

const { Op, ValidationError, where, JSON } = require("sequelize");
//const { pages } = require("pdf2html");

//-----------------------------------------------//
//-------------Comandos apiRest------------------//
//-----------------------------------------------//

//GET/users | Obs:Content-Length: false
exports.findAll = async (req, res, next) => {
  /* console.log("findAll");
  console.table(users);
  res.json(users); */

  try {
    //! ADICIONAR MAIS FILTROS
    const currentPage = req.query.page >= 0 ? req.query.page : 0;
    const limit = +req.query.limit;

    if (limit < 5 || !Number.isInteger(limit)) {
      throw new ErrorHandler(
        400,
        "Limit must be a positive integer, greater than 5"
      );
    }

    let userList = await users.findAndCountAll({
      attributes: ["username", "name", "id", "profilePicLink"],
      raw: true,
      limit: limit,
      offset: currentPage ? currentPage * limit : 0,
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${req.query.search}%` } },
          { username: { [Op.like]: `%${req.query.search}%` } },
        ],
        nationality: { [Op.like]: `%${req.query.nationality}%` },
      },
    });

    userList.rows.forEach((user, index) => {
      userList.rows[index].links = [
        { rel: "self", href: `/alumni/${user.id}`, method: "GET" },
      ];
    });

    if (userList.rows.length < 1) {
      throw new ErrorHandler(404, "Page not found");
    }

    const numPages = Math.ceil(userList.length / limit);

    links = [];

    if (currentPage > 0) {
      links.push({
        rel: "next-page",
        href: `/alumni?limit=${limit}&page=${currentPage - 1}`,
        method: "GET",
      });
    }
    if (currentPage < limit) {
      links.push({
        rel: "next-page",
        href: `/alumni?limit=${limit}&page=${currentPage + 1}`,
        method: "GET",
      });
    }

    res.status(200).json({
      pagination: {
        total: userList.rows.length,
        pages: numPages,
        current: currentPage,
        limit: limit,
      },
      data: userList.rows,
      links: links,
    });
  } catch (err) {
    next(err);
  }
};

exports.findUserId = async (req, res, next) => {
  /* console.log("findUserId"); //console.table(users)
    let user = users.filter((user) => user.id == req.params.id)[0];
    res.json(user); */

  try {
    if (!req.params.id) {
      throw new ErrorHandler(400, "The UserID was not submitted");
    }
    if (isNaN(req.params.id) || Number.isInteger(req.params.id)) {
      throw new ErrorHandler(400, "The UserID submitted is not a valid type");
    }

    //! Colocar mais atributos!
    foundUser = await users.findOne({
      attributes: ["username", "name", "id", "profilePicLink", "type"],
      raw: true,
      where: {
        id: req.params.id,
      },
    });

    if (!foundUser) {
      throw new ErrorHandler(
        404,
        `User with ID ${req.params.id} was not found`
      );
    }

    res.status(200).json(foundUser);
  } catch (err) {
    next(err);
  }
};

exports.deleteAccount = async (req, res) => {
  //! Porque é que a resposta não é dada?
  try {
    await users
      .destroy({
        where: { id: req.loggedUserId },
      })
      .then(() => {
        return res.status(204).send();
      })
      .catch((err) => {
        throw new ErrorHandler(
          500,
          "Something went wrong. Please try again later"
        );
      });
  } catch (err) {
    if (err instanceof ValidationError)
      err = new ErrorHandler(
        400,
        err.errors.map((e) => e.message)
      );
    next(err);
  }
};

exports.updateAccount = async (req, res, next) => {
  try {
    if (req.loggedUserId != req.params.id && req.loggedUserType != "admin") {
      throw new ErrorHandler(
        401,
        "You must be an ADMIN or be the owner of the account to make changes to it."
      );
    }

    //! Acrescentar atributos!
    if (
      !req.body.username &&
      !req.body.name &&
      !req.body.email &&
      !req.body.password &&
      !req.body.hasOwnProperty("consentJobs") &&
      !req.body.hasOwnProperty("consentDegrees")
    ) {
      throw new ErrorHandler(400, "Please provide any change needed");
    }

    attributesToUpdate = {};

    let userToUpdate = await users.findOne({
      where: {
        id: req.params.id,
      },
      raw: true,
    });

    //! Acrescentar atributos!
    if (userToUpdate.username != req.body.username) {
      attributesToUpdate.username = req.body.username;
    }

    if (userToUpdate.name != req.body.name) {
      attributesToUpdate.name = req.body.name;
    }

    if (userToUpdate.email != req.body.email) {
      attributesToUpdate.email = req.body.email;
    }

    if (req.body.password) {
      if (userToUpdate.password != bcrypt.hashSync(req.body.password, 10)) {
        attributesToUpdate.password = bcrypt.hashSync(req.body.password, 10);
      }
    }

    if (
      userToUpdate.consentDegrees != req.body.consentDegrees &&
      req.body.hasOwnProperty("consentDegrees")
    ) {
      attributesToUpdate.consentDegrees = req.body.consentDegrees;
    }

    if (
      userToUpdate.consentJobs != req.body.consentJobs &&
      req.body.hasOwnProperty("consentJobs")
    ) {
      attributesToUpdate.consentJobs = req.body.consentJobs;
    }

    let updatedUser = await users.update(attributesToUpdate, {
      where: {
        id: req.params.id,
      },
      raw: true,
    });

    delete attributesToUpdate.password;

    res.status(200).json({
      userInfo: {
        userId: req.loggedUserId,
        username: userToUpdate.username,
        type: req.loggedUserType,
      },
      changedData: attributesToUpdate,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateAlumni = async (req, res, next) => {
  try {
    //! Acrescentar atributos!
    if (
      !req.body.addJobs &&
      !req.body.removeJobs &&
      !req.body.addDegrees &&
      !req.body.removeDegrees
    ) {
      throw new ErrorHandler(400, "Please provide any change needed");
    }

    let addedAttributes = { jobs: [], degrees: [] };
    let removeAttributes = { jobs: [], degrees: [] };

    if (req.body.removeJobs.length > 0) {
      removeAttributes.jobs = req.body.removeJobs;
      removeAttributes.jobs.forEach((job) => {
        alumniJob.destroy({
          where: {UserId: req.loggedUserId, firstYear: job.firstYear, lastYear: job.lastYear },
        });
      });
    }
    if (req.body.removeDegrees.length > 0) {
      removeAttributes.degrees = req.body.removeDegrees;
      removeAttributes.degrees.forEach((degree) => {
        alumniDegree.destroy({
          where: {UserId: req.loggedUserId, firstYear: degree.firstYear, lastYear: degree.lastYear },
        });
      });
    }

    if (req.body.addJobs.length > 0) {
      addedAttributes.jobs = req.body.addJobs;
      addedAttributes.jobs.forEach((job) => {
        alumniJob.create({
          UserId: req.loggedUserId,
          CompanyId: job.companyId,
          firstYear: job.firstYear,
          lastYear: job.lastYear,
          role: job.role,
        });
      });
    }
    if (req.body.addDegrees.length > 0) {
      addedAttributes.degrees = req.body.addDegrees;
      addedAttributes.degrees.forEach((degree) => {
        alumniDegree.create({
          UserId: req.loggedUserId,
          DegreeId: degree.degreeId,
          firstYear: degree.firstYear,
          lastYear: degree.lastYear,
        });
      });
    }

    res.status(200).json({
      userInfo: { userId: req.loggedUserId, type: req.loggedUserType },
      changedData: {
        addedAttributes,
        removeAttributes,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    if (!req.body.username || !req.body.password) {
      throw new ErrorHandler(400, "Please provide username and password");
    }

    let userToLogin = await users.findOne({
      where: { username: req.body.username },
    });
    if (!userToLogin) throw new ErrorHandler(404, "User not found.");

    const check = bcrypt.compareSync(req.body.password, userToLogin.password);

    //UNSAFE TO STORE EVERYTHING OF USER, including PSSWD
    // sign the given payload (user ID) into a JWT payload – builds JWT token, using secret key
    const token = jwt.sign(
      { id: userToLogin.id, type: userToLogin.type },
      JWTconfig.SECRET,
      {
        // expiresIn: '24h' // 24 hours
        expiresIn: "20m", // 20 minutes
        // expiresIn: '1s' // 1 second
      }
    );

    return res.status(200).json({
      accessToken: token,
    });
  } catch (err) {
    if (err instanceof ValidationError)
      err = new ErrorHandler(
        400,
        err.errors.map((e) => e.message)
      );
    next(err);
  }
};

//POST/users
exports.createUser = async (req, res, next) => {
  //onsole.table(req.body)
  /* req.body = {
    id: checkLastId(),
    name: `${req.body.name}`,
    email: `${req.body.email}`,
    password: `${req.body.password}`,
    nationality: `${req.body.nationality}`,
  };
  users.push(req.body);
  res.status(201).json(users); */

  try {
    if (
      !req.body.name ||
      !req.body.username ||
      !req.body.email ||
      !req.body.password
    ) {
      throw new ErrorHandler(400, "Please provide username and password");
    }
    console.log(
      `\n-----\n Name: ${req.body.name} \n Username: ${req.body.username} \n  Password: ${req.body.password} \n ----------------------- \n`
    );

    let usernameList = await users.findAll({
      where: {
        username: req.body.username,
      },
    });

    let emailList = await users.findAll({
      where: {
        email: req.body.email,
      },
    });

    if (usernameList.length == 0 && emailList.length == 0) {
      let user = await users.create({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        type: "normal",
        profilePicLink:
          "https://beforeigosolutions.com/wp-content/uploads/2021/12/dummy-profile-pic-300x300-1.png",
        address: req.body.address,
        nationality: req.body.nationality,
        restricted: false,
        consentJobs: true,
        consentDegrees: true,
      });
    } else {
      throw new ErrorHandler(401, "An user is already registered.");
    }

    return res
      .status(201)
      .json({ success: true, msg: "User was registered successfully!" });
  } catch (err) {
    if (err instanceof ValidationError)
      err = new ErrorHandler(
        400,
        err.errors.map((e) => e.message)
      );
    next(err);
  }
};

//Funções de apoio
exports.bodyValidator = (req, res, next) => {
  /* if (!isRegistered(req) && req.method == "POST") {
    console.log("POST");
    next();
  } else {
    res.json("user already exists");
  } */
  next();
};

function isRegistered(req) {
  setDefaultValues(req);
  let check = users.some((user) => user.email === req.body.email);
  console.log(check);
  return check;
}

function checkLastId() {
  //console.log("checkLastId")
  return users[users.length - 1].id + 1;
}

function setDefaultValues(req) {
  if (!req.body.name) req.body.name = "User";
  if (!req.body.email) req.body.email = "user@gmail.com";
  if (!req.body.password) req.body.password = "password";
  if (!req.body.nationality) req.body.nationality = "defaultNationality";
}
