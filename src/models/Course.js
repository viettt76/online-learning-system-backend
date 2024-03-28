const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Course extends Model {}

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
            authorId: DataTypes.STRING,
            price: DataTypes.STRING,
            level: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'Course',
        },
    );

    return Course;
};
