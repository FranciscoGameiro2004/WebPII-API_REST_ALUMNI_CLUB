module.exports = (sequelize, DataTypes) => {
    const EventFollowing = sequelize.define('EventFollowing', {
        //Nota: Só contem chaves externas
    }, {timestamps: false});
    return EventFollowing
}