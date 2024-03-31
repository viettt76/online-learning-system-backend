const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class LikedCourse extends Model {}

    LikedCourse.init(
        {
            id: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            userId: DataTypes.UUID,
            courseId: DataTypes.UUID,
        },
        {
            sequelize,
            modelName: 'LikedCourse',
        },
    );
    return LikedCourse;
};
