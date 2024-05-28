module.exports = (sequelize, DataTypes) => {
    const Notification = sequelize.define('Notification', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            unique: true
        },
        message: {
            type: DataTypes.STRING
        },
        type: {
            type: DataTypes.STRING
        },
        readState: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        dateTime: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        }
    }, { timestamps: false })
    return Notification
}