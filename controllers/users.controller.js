const jwt = require("jsonwebtoken"); //JWT tokens creation (sign())
const bcrypt = require("bcryptjs"); //password encryption
const { clear } = require("console");

const JWTconfig = require("../config/jwt.config.js");
const { ErrorHandler } = require("../utils/error.js");

const notificationsController = require("../controllers/notifications.controller.js")

// import users data
const db = require("../models/index.js");
let users = db.users;
let userFollowing = db.userFollowing;
let alumniJob = db.alumniJob;
let alumniDegree = db.alumniDegree;
let degrees = db.degrees
let institutions = db.institutions
let notifications = db.notifications

const { Op, ValidationError, where, JSON } = require("sequelize");
const { raw } = require("mysql2");
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
      attributes: ["id", "username", "name", "profilePicLink", "type"],
      raw: true,
      limit: limit,
      offset: currentPage ? currentPage * limit : 0,
      where: {
        [Op.or]: 
        [
          { name: { [Op.like]: `%${req.query.search != undefined ? req.query.search : ''}%` } },
          { username: { [Op.like]: `%${req.query.search != undefined ? req.query.search : ''}%` } },
        ],
        nationality: { [Op.like]: `%${req.query.nationality != undefined ? req.query.nationality : ''}%` },
      },
    });

    userList.rows.forEach((user, index) => {
      userList.rows[index].links = [
        { rel: "self", href: `/users/${user.id}`, method: "GET" },
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
        href: `/users?limit=${limit}&page=${currentPage - 1}`,
        method: "GET",
      });
    }
    if (currentPage < limit) {
      links.push({
        rel: "next-page",
        href: `/users?limit=${limit}&page=${currentPage + 1}`,
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
      attributes: ["username", "name", "id", "profilePicLink", "type", "consentJobs", "consentDegrees"],
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

    let userInfo = {
      username: foundUser.username,
      name: foundUser.name,
      userId: foundUser.id,
      type: foundUser.type
    }

    if (foundUser.consentJobs){
      userInfo.jobs = []
      foundJob = await alumniJob.findAll({
        raw: true,
        where: {
          UserId: req.params.id,
        },
      });
      for (const job of foundJob) {
        const Company = await institutions.findOne({
          raw: true,
          where: {
            id: Degree.InstitutionId,
          },
        });
        userInfo.degrees.push({
          company: Company.designation,
          role: job.role,
          firstYear: job.firstYear,
          lastYear: job.lastYear
        })
      }
    }

    if (foundUser.consentDegrees){
      userInfo.degrees = []
      foundDegree = await alumniDegree.findAll({
        raw: true,
        where: {
          UserId: req.params.id,
        },
      });
      for (const degree of foundDegree) {
        const Degree = await degrees.findOne({
          raw: true,
          where: {
            id: degree.id,
          },
        });
        const Institution = await institutions.findOne({
          raw: true,
          where: {
            id: Degree.InstitutionId,
          },
        });
        userInfo.degrees.push({
          degree: Degree.designation,
          institution: Institution.designation,
          firstYear: degree.firstYear,
          lastYear: degree.lastYear
        })
      }
    }

    let following = []
    let followers = []

    const followersFound = await userFollowing.findAll({
      attributes: ['followingUser', 'UserId'],
      where: {
        followingUser: foundUser.id
      },
      raw:true
    })
    const followingFound = await userFollowing.findAll({
      attributes: ['UserId', 'followingUser'],
      where: {
        UserId: foundUser.id
      },
      raw:true
    })
    clear()
    console.log(followersFound);
    for (const user of followingFound){
      following.push({userId: user.followingUser})
    }
    for (const user of followersFound){
      followers.push({userId: user.UserId})
    }
    console.log(followers);
    userInfo.following = following
    userInfo.followers = followers
    res.status(200).json(userInfo);
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
  clear(); console.log("\nUsers---login")
  try {
    if (!req.body.username || !req.body.password) {
      throw new ErrorHandler(400, "Please provide username and password");
    }

    let userToLogin = await users.findOne({
      where: { username: req.body.username },
    }); console.log(userToLogin.dataValues)
    if (!userToLogin) throw new ErrorHandler(404, "User not found.");

    const check = bcrypt.compareSync(req.body.password, userToLogin.password); //console.log("check: " + check);

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

    console.table(req.headers)

    return res.status(200).json({
      userToLogin,
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

exports.followUser = async (req, res, next) => {
  try {
    if (req.params.id == req.loggedUserId){
      throw new ErrorHandler(405, 'You cannot follow yourself')
    }
    if (isNaN(req.params.id) || Number.isInteger(req.params.id)) {
      throw new ErrorHandler(400, 'The user id is not a valid type')
    }
    const userToFollow = await users.findOne({
      where: {
        id: req.params.id
      },
      raw: true,
    })
    clear()
    
    console.log(userToFollow);
    if (!userToFollow){
      throw new ErrorHandler(404, `User with ID ${req.params.id} was not found`)
    }
    const following = await userFollowing.findOne({
      where: {
        followingUser: req.params.id,
        UserId: req.loggedUserId
      }
    })
    const follower = await users.findOne({
      where: {
        id: req.loggedUserId
      }
    })
    if (following){
      throw new ErrorHandler(405, `User with ID ${req.params.id} was followed already`)
    }
    await userFollowing.create({
      UserId: req.loggedUserId,
      followingUser: req.params.id
    })

    ////! Perceber o que se passa com esta função
    //// notificationsController.createNotification(req.params.id, `${follower.name} just followed you`, 'user_following')
    await notifications.create({
      UserId: req.params.id,
      message: `${follower.name} just followed you`,
      type: 'user_following',
    });

    res.status(202).json({message: 'You are now following a user!'})
  } catch (err) {
    next(err)
  }
}

exports.unfollowUser = async (req, res, next) => {
  try {
    if (req.params.id == req.loggedUserId){
      throw new ErrorHandler(405, 'You cannot unfollow yourself')
    }
    if (isNaN(req.params.id) || Number.isInteger(req.params.id)) {
      throw new ErrorHandler(400, 'The user id is not a valid type')
    }

    const userToUnfollow = await users.findOne({
      where: {
        id: req.params.id
      },
      raw: true,
    })
    if (!userToUnfollow){
      throw new ErrorHandler(404, `User with ID ${req.params.id} was not found`)
    }

    const following = await userFollowing.findOne({
      where: {
        followingUser: req.params.id
      }
    })
    if (!following){
      throw new ErrorHandler(405, `User with ID ${req.params.id} was not followed already`)
    }

    await userFollowing.destroy({
      where: {
        UserId: req.loggedUserId,
        followingUser: req.params.id
      }
    })

    res.status(202).json({message: 'You just unfollowed a user!'})
  } catch (err) {
    next(err)
  }
}

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