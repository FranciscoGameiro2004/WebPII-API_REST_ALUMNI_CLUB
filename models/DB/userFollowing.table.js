module.exports = (sequelize, DataTypes) => {
    const UserFollowing = sequelize.define('UserFollowing', {
        followingUser: {
            type: DataTypes.INTEGER,
            unique: false
        },
    }, {timestamps: false});
    return UserFollowing
}