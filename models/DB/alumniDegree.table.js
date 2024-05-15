module.exports = (sequelize, DataTypes) => {
    const AlumniDegree = sequelize.define('AlumniDegree', {
        firstYear: {
            type: DataTypes.INTEGER,
        },
        lastYear: {
            type: DataTypes.INTEGER
        },
    }, {timestamps: false});
    return AlumniDegree
}