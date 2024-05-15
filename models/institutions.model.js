module.exports = (sequelize, DataTypes) => {
    const Institution = sequelize.define('Degrees', {
        id: {
            type: DataTypes.INT,
            primaryKey: true
        },
        designation: {
            type: DataTypes.STRING
        },
        address: {
            type: DataTypes.STRING
        },
        url: {
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING
        },
        phoneNumber: {
            type: DataTypes.INT
        }
    }, {timestamps: false});
    return Institution
}