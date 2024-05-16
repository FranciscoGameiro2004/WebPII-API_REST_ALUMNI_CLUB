const jwt = require("jsonwebtoken"); //JWT tokens creation (sign())
const bcrypt = require("bcryptjs"); //password encryption

const JWTconfig = require("../config/jwt.config.js");
const { ErrorHandler } = require("../utils/error.js");

// import users data
const db = require("../models/index.js");
let users = db.users;

const { Op, ValidationError, where, JSON } = require("sequelize");

//-----------------------------------------------//
//-------------Comandos apiRest------------------//
//-----------------------------------------------//

//GET/users | Obs:Content-Length: false
exports.findAll = (req, res) => {
  console.log("findAll");
  console.table(users);
  res.json(users);
};

exports.findUserId = (req, res) => {
  console.log("findUserId"); //console.table(users)
  let user = users.filter((user) => user.id == req.params.id)[0];
  res.json(user);
};

exports.deleteAccount = async (req, res) => {
  //! Porque é que a resposta não é dada?
  try {
    await users.destroy({
      where: { id: req.loggedUserId },
    }).then( () => {
      return res.status(204).send()
      }).catch(err => {
        throw new ErrorHandler(500, "Something went wrong. Please try again later")
        });
  } catch (error) {
    
  }
};

exports.updateAccount =  (req, res) => {
  
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
