const { DataSource } = require("typeorm");

const AppDataSource = new DataSource({
  type: "mysql",
  host: "johnny.heliohost.org",
  port: 3306,
  username: "viettt75_admin",
  password: "Z1s49kf9_",
  database: "viettt75_vedu",
  synchronize: false,
  logging: false,
  entities: ["src/entity/*.js"],
  migrations: [],
  subscribers: [],
});

module.exports = { AppDataSource };
