const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Course extends Model {
        static associate(models) {
            Course.belongsTo(models.User, { foreignKey: 'authorId', targetKey: 'id', as: 'authorInfo' });
            Course.hasMany(models.Chapter, { foreignKey: 'courseId', as: 'chapterInfo' });
        }
    }

    Course.init(
        {
            id: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            img: DataTypes.BLOB('long'),
            name: DataTypes.STRING,
            description: DataTypes.TEXT,
            authorId: DataTypes.UUID,
            price: DataTypes.INTEGER,
            level: DataTypes.STRING,
            numberOfParticipants: DataTypes.INTEGER,
            numberOfReviews: DataTypes.INTEGER,
            totalStars: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'Course',
        },
    );

    return Course;
};
