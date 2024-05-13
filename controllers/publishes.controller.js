// import users data
let publishes = require("../models/publishes.model");

//-----------------------------------------------//
//-------------Comandos apiRest------------------//
//-----------------------------------------------//

//GET/publishes | Obs:Content-Length: false
exports.findAll = (req, res) => {
  console.log("findAll");//console.table(publishes)
  res.json(publishes);
};




//Funções de apoio
exports.bodyValidator = (req, res, next) => {
  if(!isRegistered(req) && req.method=='POST') {
    console.log("POST")
    next();
  }
  else {
    res.json("event already exists")
  }
}
