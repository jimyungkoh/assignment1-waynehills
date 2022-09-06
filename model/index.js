"use strict";

const Sequelize = require("sequelize");
const config = require("../config/config");
const environment = "production";
const env_conf = config[environment];

const sequelize = new Sequelize(
  env_conf.database,
  env_conf.username,
  env_conf.password,
  env_conf
);

const defineUserModel = require("../components/users/userModel");
const definePostModel = require("../components/posts/postModel");

const UserModel = defineUserModel(sequelize);
const PostModel = definePostModel(sequelize);

// model 간 관계를 정의합니다.
Object.values(sequelize.models).forEach((model) => {
  if (model.associate) {
    model.associate(sequelize.models);
  }
});

/**
 * sequelize, 모델 모음
 * @todo exports에 sequelize를 이용해 생성한 모델들 담아주기
 * */
module.exports = {
  sequelize,
  UserModel,
  PostModel,
};
