const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class LessonBeingViewed extends Model {}

    LessonBeingViewed.init(
        {
            id: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            userId: DataTypes.UUID,
            lessonId: DataTypes.UUID,
            timeStamp: DataTypes.TIME,
        },
        {
            sequelize,
            modelName: 'LessonBeingViewed',
        },
    );
    return LessonBeingViewed;
};
