module.exports = (sequelize, DataTypes) => {
    const Institution = sequelize.define('Institution', {
       
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
    return Institution
}