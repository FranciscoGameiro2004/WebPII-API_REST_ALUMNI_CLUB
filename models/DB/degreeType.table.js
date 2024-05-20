module.exports = (sequelize, DataTypes) => {
    const DegreeType = sequelize.define('DegreeType', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true
        },
        designation: {
            type: DataTypes.STRING
        },
    }, {timestamps: false});
    return DegreeType
}