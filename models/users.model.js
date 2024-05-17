/* //Users data
const users = 
[
  {id: 1, name: "Carlos",email: "carlos@email.com", password: "12345", nationality: "None"},
  {id: 2, name: "Maria", email: "maria@email.com", password: "54321", nationality: "Brazil"},
  {id: 3, name: "John", email: "john@email.com", password: "abcde", nationality: "USA"},
  {id: 4, name: "Sophie", email: "sophie@email.com", password: "qwerty", nationality: "France"},
  {id: 5, name: "Li", email: "li@email.com", password: "asdfg", nationality: "China"}
]

//Data will go here
module.exports = users;  */

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
      id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          unique: true
      },
      name: {
          type: DataTypes.STRING
      },
      username: {
          type: DataTypes.STRING
      },
      email: {
          type: DataTypes.STRING
      },
      password: {
          type: DataTypes.STRING
      },
      type: {
          type: DataTypes.STRING
      },
      profilePicLink: {
          type: DataTypes.STRING
      },
      address: {
        type: DataTypes.STRING
      },
      nationality: {
        type: DataTypes.STRING
      },
      restricted: {
        type: DataTypes.BOOLEAN
      },
      consentJobs: {
        type: DataTypes.BOOLEAN,
        default: true
      },
      consentDegrees: {
        type: DataTypes.BOOLEAN,
        default: true
      }
  }, {timestamps: false});
  return User
}