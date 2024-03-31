const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Lesson extends Model {}

    Lesson.init(
        {
            id: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            chapterId: DataTypes.UUID,
            name: DataTypes.STRING,
            time: DataTypes.TIME,
        },
        {
            sequelize,
            modelName: 'Lesson',
        },
    );
    return Lesson;
};
