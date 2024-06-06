'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable(
            'users',
            {
                id: {
                    type: Sequelize.UUID,
                    primaryKey: true,
                    allowNull: false,
                    defaultValue: Sequelize.UUIDV4,
                },
                email: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                familyName: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                givenName: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                job: {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                introduction: {
                    type: Sequelize.TEXT,
                    allowNull: true,
                },
                picture: {
                    type: Sequelize.BLOB('long'),
                    allowNull: false,
                },
                isTeacher: {
                    type: Sequelize.BOOLEAN,
                    allowNull: false,
                    defaultValue: false,
                },
                createdAt: {
                    type: Sequelize.DATE,
                },
                updatedAt: {
                    type: Sequelize.DATE,
                },
            },
            {
                charset: 'utf8mb4',
                collate: 'utf8mb4_general_ci',
            },
        );
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('users');
    },
};
