const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class CourseSale extends Model {}

    CourseSale.init(
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
            modelName: 'CourseSale',
        },
    );
    return CourseSale;
};
