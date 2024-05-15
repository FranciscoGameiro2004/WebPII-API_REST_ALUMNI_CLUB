const dbConfig = require("../config/db.config.js");
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection do DB has been established successfully.");
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
})();

const db = {};
//export the sequelize object (DB connection)
db.sequelize = sequelize;

// Models
db.users = require("./users.model.js")(sequelize, DataTypes);
db.degrees = require("./degrees.model.js")(sequelize, DataTypes);
db.institutions = require("./institutions.model.js")(sequelize, DataTypes);

db.zipCode = require('./DB/zipCode.table.js')(sequelize, DataTypes);
db.degreeType = require('./DB/degreeType.table.js')(sequelize, DataTypes);
db.alumniDegree = require('./DB/alumniDegree.table.js')(sequelize, DataTypes);
db.alumniJob = require('./DB/alumniJob.table.js')(sequelize, DataTypes);
db.company = require('./DB/company.table.js')(sequelize, DataTypes);
//! Colocar relações
//? Perguntar à professora como é que mudo o nome de um parâmetro

db.institutions.hasMany(db.degrees)
db.degrees.belongsTo(db.institutions)

db.zipCode.hasMany(db.users)
db.users.belongsTo(db.zipCode)

db.zipCode.hasMany(db.institutions)
db.institutions.belongsTo(db.zipCode)

db.zipCode.hasMany(db.company)
db.company.belongsTo(db.zipCode)

db.users.hasMany(db.alumniDegree)
db.alumniDegree.belongsTo(db.users)

db.users.hasMany(db.alumniJob)
db.alumniJob.belongsTo(db.users)

db.degreeType.hasMany(db.degrees)
db.degrees.belongsTo(db.degreeType)

db.degrees.hasMany(db.alumniDegree)
db.alumniDegree.belongsTo(db.degrees)

db.company.hasMany(db.alumniJob)
db.alumniJob.belongsTo(db.company)

// optionally: SYNC
//? Perguntar à professora sobre o que quer que tenha ocorrido
try {
  // sequelize.sync({ force: true }); // creates tables, dropping them first if they already existed
  sequelize.sync({ alter: true }); // checks the tables in the database (which columns they have, what are their data types, etc.), and then performs the necessary changes to make then match the models
  // sequelize.sync(); // creates tables if they don't exist (and does nothing if they already exist)
  console.log("DB is successfully synchronized");
} catch (error) {
  console.log(error);
}
/* (async () => {
  try {
    // await sequelize.sync({ force: true }); // creates tables, dropping them first if they already existed
     await sequelize.sync({ alter: true }); // checks the tables in the database (which columns they have, what are their data types, etc.), and then performs the necessary changes to make then match the models
    // await sequelize.sync(); // creates tables if they don't exist (and does nothing if they already exist)
    console.log("DB is successfully synchronized");
  } catch (error) {
    console.log(error);
  }
})(); */

module.exports = db;