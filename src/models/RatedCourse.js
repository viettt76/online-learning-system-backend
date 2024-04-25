const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class RatedCourse extends Model {}

    RatedCourse.init(
        {
            id: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            userId: DataTypes.UUID,
            courseId: DataTypes.UUID,
            star: DataTypes.TINYINT,
        },
        {
            sequelize,
            modelName: 'RatedCourse',
        },
    );
    return RatedCourse;
};
