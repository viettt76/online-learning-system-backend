'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable(
            'lessons',
            {
                id: {
                    type: Sequelize.UUID,
                    primaryKey: true,
                    allowNull: false,
                    defaultValue: Sequelize.UUIDV4,
                },
                chapterId: {
                    type: Sequelize.UUID,
                    allowNull: false,
                },
                lessonNumber: {
                    type: Sequelize.SMALLINT,
                    allowNull: false,
                },
                name: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                video: {
                    type: Sequelize.TEXT,
                    allowNull: false,
                },
                time: {
                    type: Sequelize.INTEGER,
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
        await queryInterface.dropTable('lessons');
    },
};
