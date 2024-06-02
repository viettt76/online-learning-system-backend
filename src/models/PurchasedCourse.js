const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Purchased_Course extends Model {
        static associate(models) {
            Purchased_Course.belongsTo(models.Course, {
                foreignKey: 'courseId',
                targetKey: 'id',
                as: 'purchasedCourseInfo',
            });
        }
    }

    Purchased_Course.init(
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
            modelName: 'Purchased_Course',
        },
    );
    return Purchased_Course;
};
