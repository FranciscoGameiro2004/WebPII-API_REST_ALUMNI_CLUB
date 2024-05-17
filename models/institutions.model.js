module.exports = (sequelize, DataTypes) => {
    const Institution = sequelize.define('Institution', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            unique: true
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
            type: DataTypes.STRING
        }
    }, { timestamps: false });
    return Institution;
}
