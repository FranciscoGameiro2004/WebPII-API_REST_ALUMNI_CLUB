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
