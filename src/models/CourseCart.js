const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Courses_Cart extends Model {
        static associate(models) {
            Courses_Cart.belongsTo(models.Course, { foreignKey: 'courseId', targetKey: 'id', as: 'courseCartInfo' });
        }
    }

    Courses_Cart.init(
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
            modelName: 'Courses_Cart',
        },
    );
    return Courses_Cart;
};
