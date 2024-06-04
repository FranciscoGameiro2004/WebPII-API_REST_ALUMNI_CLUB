module.exports = (sequelize, DataTypes) => {
    const EventDate = sequelize.define('EventDate', {
        date: {
            type: DataTypes.DATEONLY,
        },
        startTime: {
            type: DataTypes.TIME
        },
        endTime: {
            type: DataTypes.TIME
        },
    }, {timestamps: false});
    return EventDate
}