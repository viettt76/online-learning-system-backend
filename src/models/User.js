const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {}
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
