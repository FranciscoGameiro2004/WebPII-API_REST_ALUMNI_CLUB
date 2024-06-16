const dbConfig = require("../config/db.config.js");
const { Sequelize, DataTypes } = require("sequelize");

const bcrypt = require("bcryptjs"); //password encryption
const clear = require("clear");

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
db.notifications = require('./notifications.model.js')(sequelize, DataTypes);
db.events = require('./events.model.js')(sequelize,DataTypes);
db.publications = require('./publishes.model.js')(sequelize, DataTypes)

db.zipCode = require('./DB/zipCode.table.js')(sequelize, DataTypes);
db.degreeType = require('./DB/degreeType.table.js')(sequelize, DataTypes);
db.alumniDegree = require('./DB/alumniDegree.table.js')(sequelize, DataTypes);
db.alumniJob = require('./DB/alumniJob.table.js')(sequelize, DataTypes);
db.company = require('./DB/company.table.js')(sequelize, DataTypes);
db.userFollowing = require('./DB/userFollowing.table.js')(sequelize, DataTypes);
db.eventDate = require('./DB/eventDate.table.js')(sequelize, DataTypes);
db.eventFollowing = require('./DB/eventFollowing.table.js')(sequelize, DataTypes);
db.eventParticipant = require('./DB/eventParticipant.table.js')(sequelize, DataTypes);
db.comment = require('./DB/comment.table.js')(sequelize, DataTypes);


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

db.users.hasMany(db.notifications)
db.notifications.belongsTo(db.users)

//! Aprimorar relações
db.users.hasMany(db.userFollowing)
db.userFollowing.hasMany(db.users)

db.events.hasMany(db.eventDate)
db.eventDate.belongsTo(db.events)

db.events.hasMany(db.eventFollowing)
db.eventFollowing.belongsTo(db.events)

db.users.hasMany(db.eventFollowing)
db.eventFollowing.belongsTo(db.users)

db.users.hasMany(db.eventParticipant)
db.eventParticipant.belongsTo(db.users)

db.events.hasMany(db.eventParticipant)
db.eventParticipant.belongsTo(db.events)

db.users.hasMany(db.publications)
db.publications.belongsTo(db.users)

db.users.hasMany(db.comment)
db.comment.belongsTo(db.users)

db.publications.hasMany(db.comment)
db.comment.belongsTo(db.publications)
// optionally: SYNC
//? Perguntar à professora sobre o que quer que tenha ocorrido
try {
  clear()
  //sequelize.sync({ force: true }); // creates tables, dropping them first if they already existed
  sequelize.sync({ alter: true }); // checks the tables in the database (which columns they have, what are their data types, etc.), and then performs the necessary changes to make then match the models
  //sequelize.sync(); // creates tables if they don't exist (and does nothing if they already exist)
  //console.log("DB is successfully synchronized");
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

/* let user = db.users.create({
  name: 'admin',
  username: 'admin',
  email: 'admin@email.com',
  password: bcrypt.hashSync('admin', 10),
  type: "admin",
  profilePicLink:
    "https://beforeigosolutions.com/wp-content/uploads/2021/12/dummy-profile-pic-300x300-1.png",
  address: 'Rua D. Sancho I, n.º 981',
  nationality: 'PT',
  restricted: false,
  consentJobs: true,
  consentDegrees: true,
}); */


/* await db.degreeType.create({
  designation: "Curso Técnico Superior"
}); 
await db.degreeType.create({
  designation: "Licenciatura"
}); 
await db.degreeType.create({
  designation: "Pós-Gradugação"
});  
await db.degreeType.create({
  designation: "Mestrado"
});
await db.degreeType.create({
  designation: "Doutoramento"
});  */



/* let notification = db.notifications.create({
        UserId: 3,
        message: 'Message',
        type: 'normal',
    }) */

module.exports = db;
