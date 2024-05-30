<<<<<<< HEAD
module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define('Events', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true
      },
      name: {
        type: DataTypes.STRING
      },
      date: {
        type: DataTypes.DATEONLY
      },
      startTime: {
        type: DataTypes.TIME
      },
      endTime: {
        type: DataTypes.TIME
      }
  }, { timestamps: false });
  return Event;
}
=======
/*
// Eventos data
const events = 
[
  {id: 1, name: "Conferência de Tecnologia", location: "São Paulo", date: "2024-06-15", attendees: ["Carlos", "Maria", "John"]},
  {id: 2, name: "Festival de Cinema", location: "Cannes", date: "2024-07-01", attendees: ["Sophie", "Carlos", "Li"]},
  {id: 3, name: "Exposição de Arte", location: "Nova York", date: "2024-08-10", attendees: ["John", "Sophie", "Li"]},
  {id: 4, name: "Feira de Livros", location: "Beijing", date: "2024-09-05", attendees: ["Li", "Maria", "Carlos"]}
]

// Data will go here
module.exports = events; 
*/


module.exports = (sequelize, DataTypes) => {
    const Event = sequelize.define('Event', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            unique: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        date: {
            type: DataTypes.DATEONLY, // Date only, no time
            allowNull: false
        },
        startTime: {
            type: DataTypes.TIME, // Time only, no date
            allowNull: false
        },
        endTime: {
            type: DataTypes.TIME, // Time only, no date
            allowNull: false
        }
    }, { 
        timestamps: false 
    });
    return Event;
  };
  
>>>>>>> 6493558b564d197c3c608c27ae44eb56ce115fcb
