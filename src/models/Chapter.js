const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Chapter extends Model {
        static associate(models) {
            Chapter.belongsTo(models.Course, { foreignKey: 'courseId', targetKey: 'id', as: 'chapterInfo' });
            Chapter.hasMany(models.Lesson, { foreignKey: 'chapterId', as: 'lessonInfo' });
        }
    }

    Chapter.init(
        {
            id: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            courseId: DataTypes.UUID,
            chapterNumber: DataTypes.SMALLINT,
            title: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'Chapter',
        },
    );
    return Chapter;
};
