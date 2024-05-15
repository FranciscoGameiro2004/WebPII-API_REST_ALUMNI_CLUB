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
  console.log("findUserId");//console.table(users)
  let user = users.filter(user => user.id == req.params.id)[0]
  res.json(user)
}

//POST/users
exports.createUser = (req, res) => {
  //onsole.table(req.body)
  req.body=
  {
    "id": checkLastId(),
    "name": `${req.body.name}`,
    "email": `${req.body.email}`,
    "password": `${req.body.password}`,
    "nationality": `${req.body.nationality}`
} 
  users.push(req.body)
  res.status(201).json(users);
}




//Funções de apoio
exports.bodyValidator = (req, res, next) => {
  if(!isRegistered(req) && req.method=='POST') {
    console.log("POST")
    next();
  }
  else {
    res.json("user already exists")
  }
}

exports.isAdmin = (req, res, next) => {
  
}

function isRegistered(req) {
  setDefaultValues(req)
  let check = users.some(user => user.email === req.body.email);console.log(check);
  return check
}

function checkLastId() {
  //console.log("checkLastId")
  return ((users[users.length-1].id)+1)
}

function setDefaultValues(req) {
  if (!req.body.name) req.body.name = "User";
  if (!req.body.email) req.body.email = "user@gmail.com";
  if (!req.body.password) req.body.password = "password";
  if (!req.body.nationality) req.body.nationality = "defaultNationality";
}