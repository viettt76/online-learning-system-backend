'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('lessons_being_viewed', {
            id: {
                type: Sequelize.UUID,
                primaryKey: true,
                allowNull: false,
                defaultValue: Sequelize.UUIDV4,
            },
            userId: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            lessonId: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            timeStamp: {
                type: Sequelize.TIME,
                allowNull: false,
            },
            createdAt: {
                type: Sequelize.DATE,
            },
            updatedAt: {
                type: Sequelize.DATE,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('lessons_being_viewed');
    },
};
