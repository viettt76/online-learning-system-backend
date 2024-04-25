const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Lesson extends Model {
        static associate(models) {
            Lesson.belongsTo(models.Chapter, { foreignKey: 'chapterId', targetKey: 'id', as: 'lessonInfo' });
        }
    }

    Lesson.init(
        {
            id: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            chapterId: DataTypes.UUID,
            lessonNumber: DataTypes.SMALLINT,
            name: DataTypes.STRING,
            video: DataTypes.TEXT,
            time: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'Lesson',
        },
    );
    return Lesson;
};
