// import users data
let users = require("../models/users.model");

//-----------------------------------------------//
//-------------Comandos apiRest------------------//
//-----------------------------------------------//

//GET/users | Obs:Content-Length: false
exports.findAll = (req, res) => {
  console.log("findAll");console.table(users)
  res.json(users);
};

exports.findUserId = (req, res) => {
  console.log("findUserId");console.table(users)
  let user = users.filter(user => user.id == req.params.id)[0]
  res.json(user)
}



//POST/users
exports.createUser = (req, res) => {
  console.table(req.body)
  users.push(req.body)
  res.json("POST/users");
}

//Funções de apoio
exports.bodyValidator = (req, res, next) => {
  if(!isUserRegistered(req) && req.method=='POST') {
    console.log("POST")
    next();
  }
  else {
    res.json("user already exists")
  }
}

function isUserRegistered(req) {
  let check = users.some(user => user.email === req.body.email);console.log(check);
  return check
}

function checkLastId() {
  //console.log("checkLastId")
  return ((users[users.length-1].id)+1)
}
