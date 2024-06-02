const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Lesson_Being_Viewed extends Model {}

    Lesson_Being_Viewed.init(
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
            modelName: 'Lesson_Being_Viewed',
        },
    );
    return Lesson_Being_Viewed;
};
