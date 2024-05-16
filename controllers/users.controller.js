const jwt = require("jsonwebtoken"); //JWT tokens creation (sign())
const bcrypt = require("bcryptjs"); //password encryption

const JWTconfig = require("../config/jwt.config.js");
const { ErrorHandler } = require("../utils/error.js");

// import users data
const db = require("../models/index.js");
let users = db.users;

const { Op, ValidationError, where, JSON } = require("sequelize");
const { pages } = require("pdf2html");

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
      limit: limit, offset: currentPage ? currentPage * limit : 0,
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

    if (userList.rows.length < 1){
      throw new ErrorHandler(
        404,
        "Page not found"
      );
    }

    const numPages = Math.ceil(userList.length / limit);

    links = []

    if (currentPage > 0){
      links.push({"rel":"next-page","href":`/alumni?limit=${limit}&page=${currentPage-1}`,"method":"GET"})
    }
    if (currentPage < limit){
      links.push({"rel":"next-page","href":`/alumni?limit=${limit}&page=${currentPage+1}`,"method":"GET"})
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

exports.findUserId = (req, res) => {
  /* console.log("findUserId"); //console.table(users)
  let user = users.filter((user) => user.id == req.params.id)[0];
  res.json(user); */
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

exports.updateAccount = (req, res) => {};

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
