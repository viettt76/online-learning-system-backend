const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class PurchasedCourse extends Model {}

    PurchasedCourse.init(
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
            modelName: 'PurchasedCourse',
        },
    );
    return PurchasedCourse;
};
