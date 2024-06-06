const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('railway', 'root', 'ZDEHwTaRwQXhFQUhuBJoHCUAzcYqCOVf', {
    host: 'monorail.proxy.rlwy.net',
    dialect: 'mysql',
    logging: false,
    define: {
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
        timestamps: true,
    },
    port: 23092,
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

module.exports = connectDB;
