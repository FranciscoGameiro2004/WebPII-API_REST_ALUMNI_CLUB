module.exports = (sequelize, DataTypes) => {
  const Degree = sequelize.define(
    "Degrees",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      designation: {
        type: DataTypes.STRING,
      },
    },
    { timestamps: false }
  );
  return Degree;
};
