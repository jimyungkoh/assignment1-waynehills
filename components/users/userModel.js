/**
 * @todo 유저 모델 생성 및 export 하기
 * */
const { DataTypes } = require("sequelize");

/**
 * unique: username, phoneNumber
 * null true: birthday, gender
 * 외래키 userId 속성이 존재합니다.
 * createdAt, updatedAt, deletedAt이 존재합니다.
 * underscored: true 를 사용하여 자동으로 snake_case로 변환됩니다.
 *  */

module.exports = (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        // UNSIGNED: 양수형 정수만 받는 속성
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      username: {
        // 사용자 로그인Id
        type: DataTypes.STRING(15),
        allowNull: false,
        unique: true,
      },
      password: {
        // bcrypt 암호화시 String타입으로 리턴값이 나오기에 string타입으로 지정했습니다
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      phoneNumber: {
        // 010-1111-1111 과 같이 하이픈도 같이 DB에 저장합니다.
        type: DataTypes.STRING(15),
        allowNull: false,
        unique: true,
      },
      role: {
        type: DataTypes.ENUM("user", "admin"),
        allowNull: false,
        defaultValue: "user",
      },
      gender: {
        type: DataTypes.ENUM("mail", "femail"),
      },
      birthday: {
        type: DataTypes.DATEONLY,
      },
      lastLoginDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      timestamps: true,
      modelName: "User",
      tableName: "users",
      paranoid: true,
      underscored: true,
      charset: "utf8",
      collate: "utf8_general_ci",
    }
  );
  User.associate = (models) => {
    User.hasMany(models.Post, {
      foreignKey: {
        name: "userId",
        allowNull: false,
        type: DataTypes.BIGINT.UNSIGNED,
      },
      sourceKey: "id",
    });
  };
  return User;
};
