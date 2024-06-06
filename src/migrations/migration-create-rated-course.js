'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable(
            'rated_courses',
            {
                id: {
                    type: Sequelize.UUID,
                    primaryKey: true,
                    allowNull: false,
                    defaultValue: Sequelize.UUIDV4,
                },
                userId: {
                    type: Sequelize.UUID,
                    allowNull: false,
                },
                courseId: {
                    type: Sequelize.UUID,
                    allowNull: false,
                },
                star: {
                    type: Sequelize.TINYINT,
                    allowNull: false,
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
        await queryInterface.dropTable('rated_courses');
    },
};
