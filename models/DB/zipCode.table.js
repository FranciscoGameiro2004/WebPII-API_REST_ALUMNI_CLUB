module.exports = (sequelize, DataTypes) => {
    const ZipCode = sequelize.define('ZipCode', {
        zipCode: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        locality: {
            type: DataTypes.STRING
        },
    }, {timestamps: false});
    return ZipCode
}