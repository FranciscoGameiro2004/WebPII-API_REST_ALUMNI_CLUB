module.exports = (sequelize, DataTypes) => {
    const EventParticipant = sequelize.define('EventParticipant', {
        role: {
            type: DataTypes.STRING,
        },
    }, {timestamps: false});
    return EventParticipant
}