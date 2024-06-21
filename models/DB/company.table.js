module.exports = (sequelize, DataTypes) => {
    const Company = sequelize.define('Company', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true,
            defaultValue: 1,
        },
        designation: {
            type: DataTypes.STRING
        },
        address: {
            type: DataTypes.STRING
        },
        logoUrl: {
            type: DataTypes.STRING
        },
        url: {
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING
        },
        phoneNumber: {
            type: DataTypes.INTEGER
        }
    }, {timestamps: false});
    return Company
}