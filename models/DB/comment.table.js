module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define('Comment', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true
        },
        body: {
            type: DataTypes.STRING
        },
        dateTime: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
      }
    }, {timestamps: false});
    return Comment
  }