import { config } from "dotenv";

config();

const env = process.env;

export const PORT = env.SERVER_PORT || 8080;

export const development = {
  username: env.MYSQL_USERNAME,
  password: env.MYSQL_PASSWORD,
  database: env.MYSQL_NAME,
  host: env.MYSQL_HOST,
  dialect: "mysql",
  port: env.MYSQL_PORT,
  logging: false,
};

export const production = {
  username: env.MYSQL_USERNAME,
  password: env.MYSQL_PASSWORD,
  database: env.MYSQL_NAME,
  host: env.MYSQL_HOST,
  dialect: "mysql",
  port: env.MYSQL_PORT,
  logging: false,
};

export const test = {
  username: env.MYSQL_USERNAME,
  password: env.MYSQL_PASSWORD,
  database: env.MYSQL_NAME,
  host: env.MYSQL_HOST,
  dialect: "mysql",
  port: env.MYSQL_PORT,
  logging: false,
};

export const jwtConfig = {
  secretKey: env.JWT_SECRET,
  option: {
    algorithm: "HS256",
    expiresIn: env.JWT_EXPIRES_IN,
    issuer: env.JWT_ISSUER,
  },
};

export const SECRET_KEY = env.SECRET_KEY;
