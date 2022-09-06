require("dotenv").config();
//const path = require('path');
// require("dotenv").config({ path: __dirname + "/dev.env" });

const env = process.env;

const PORT = env.SERVER_PORT || 8080;

const development = {
  username: env.MYSQL_USERNAME,
  password: env.MYSQL_PASSWORD,
  database: env.MYSQL_NAME,
  host: env.MYSQL_HOST,
  dialect: "mysql",
  port: env.MYSQL_PORT,
  logging: false,
};

const production = {
  username: env.MYSQL_USERNAME,
  password: env.MYSQL_PASSWORD,
  database: env.MYSQL_NAME,
  host: env.MYSQL_HOST,
  dialect: "mysql",
  port: env.MYSQL_PORT,
  logging: false,
};

const test = {
  username: env.MYSQL_USERNAME,
  password: env.MYSQL_PASSWORD,
  database: env.MYSQL_NAME,
  host: env.MYSQL_HOST,
  dialect: "mysql",
  port: env.MYSQL_PORT,
  logging: false,
};

const jwtConfig = {
  secretKey: env.JWT_SECRET,
  option: {
    algorithm: "HS256",
    expiresIn: env.JWT_EXPIRES_IN,
    issuer: env.JWT_ISSUER,
  },
};

const SECRET_KEY = env.SECRET_KEY;

module.exports = { development, production, test, PORT, SECRET_KEY, jwtConfig };
