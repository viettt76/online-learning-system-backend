const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class CourseCart extends Model {}

    CourseCart.init(
        {
            id: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            userId: DataTypes.STRING,
            courseId: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'CourseCart',
        },
    );
    return CourseCart;
};
