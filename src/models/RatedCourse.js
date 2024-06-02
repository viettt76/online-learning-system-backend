const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Rated_Course extends Model {}

    Rated_Course.init(
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
            modelName: 'Rated_Course',
        },
    );
    return Rated_Course;
};
