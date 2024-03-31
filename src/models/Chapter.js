const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Chapter extends Model {}

    Chapter.init(
        {
            id: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            ChapterId: DataTypes.UUID,
            title: DataTypes.UUID,
        },
        {
            sequelize,
            modelName: 'Chapter',
        },
    );
    return Chapter;
};
