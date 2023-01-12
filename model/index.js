"use strict";

import { Sequelize } from "sequelize";
import * as config from "../config/config";
import defineUserModel from "../components/users/userModel";
import definePostModel from "../components/posts/postModel";

const environment = "production";
const env_conf = config[environment];

const sequelize = new Sequelize(
  env_conf.database,
  env_conf.username,
  env_conf.password,
  env_conf
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
