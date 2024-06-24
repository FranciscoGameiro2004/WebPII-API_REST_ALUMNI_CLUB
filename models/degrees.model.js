module.exports = (sequelize, DataTypes) => {
  const Degree = sequelize.define(
    "Degree",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true
      },
      designation: {
        type: DataTypes.STRING,
      },
    },
    { timestamps: false }
  );
  return Degree;
};
