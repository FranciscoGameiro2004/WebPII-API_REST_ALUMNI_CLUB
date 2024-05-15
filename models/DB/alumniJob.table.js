module.exports = (sequelize, DataTypes) => {
    const AlumniJob = sequelize.define('AlumniJob', {
        firstYear: {
            type: DataTypes.INTEGER,
        },
        lastYear: {
            type: DataTypes.INTEGER
        },
        role: {
            type: DataTypes.STRING
        },
    }, {timestamps: false});
    return AlumniJob
}