const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Liked_Course extends Model {
        static associate(models) {
            Liked_Course.belongsTo(models.User, { foreignKey: 'id', targetKey: 'id', as: 'userLikedCourse' });
            Liked_Course.belongsTo(models.Course, { foreignKey: 'courseId', targetKey: 'id', as: 'likedCourseInfo' });
        }
    }

    Liked_Course.init(
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
            modelName: 'Liked_Course',
        },
    );
    return Liked_Course;
};
