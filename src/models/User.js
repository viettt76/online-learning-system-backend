const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            User.hasMany(models.Course, { foreignKey: 'authorId', as: 'authorInfo' });
            User.hasOne(models.Liked_Course, { foreignKey: 'userId', as: 'userLikedCourse' });
        }
    }

    User.init(
        {
            id: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            email: DataTypes.STRING,
            job: DataTypes.STRING,
            introduction: DataTypes.TEXT,
            familyName: DataTypes.STRING,
            givenName: DataTypes.STRING,
            picture: DataTypes.BLOB('long'),
            isTeacher: DataTypes.BOOLEAN,
        },
        {
            sequelize,
            modelName: 'User',
        },
    );
    return User;
};
