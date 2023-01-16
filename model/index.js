"use strict";

import { Sequelize } from "sequelize";
import * as config from "../config/config.js";
import defineUserModel from "../components/users/userModel.js";
import definePostModel from "../components/posts/postModel.js";

const environment = "production";
const env_conf = config[environment];

const sequelize = new Sequelize(
  env_conf.database,
  env_conf.username,
  env_conf.password,
  {
    host: env_conf.host,
    port: parseInt(env_conf.port),
    dialect: env_conf.dialect,
  }
);

const UserModel = defineUserModel(sequelize);
const PostModel = definePostModel(sequelize);

// model 간 관계를 정의합니다.
Object.values(sequelize.models).forEach((model) => {
  if (model.associate) {
    model.associate(sequelize.models);
  }
});

export { sequelize, UserModel, PostModel };
