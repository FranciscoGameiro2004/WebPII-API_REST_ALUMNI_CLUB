// import movies data
let users = require("../models/users.model");

//-----------------------------------------------//
//-------------Comandos apiRest------------------//
//-----------------------------------------------//

//GET/users
exports.findAll = (req, res) => {
  console.table(users)
  res.json(users);
};

//POST/users
exports.createUser = (req, res) => {
  console.table(req.body)
  res.json("POST/users");
}


exports.bodyValidator = (req, res, next) => {
  if(isUserRegistered(req) && req.method=='POST') {
    console.log("POST")
    next();
  }
  else {
    res.json("user already exists")
  }
}

function isUserRegistered(req) {
  return users.some(user => user.email === req.body.email);
}

function checkLastId() {
  //console.log("checkLastId")
  return ((users[users.length-1].id)+1)
}
