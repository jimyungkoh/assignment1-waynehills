/**
 * @todo 게시판 모델 생성 및 export 하기
 * */

const DataTypes = require("sequelize");

/**
 * 모든 속성은 unique: false, null: false 입니다.
 * 외래키 userId 속성이 존재합니다.
 * createdAt, updatedAt, deletedAt이 존재합니다.
 * underscored: true 를 사용하여 자동으로 snake_case로 변환됩니다.
 *  */

module.exports = (sequelize) => {
  const Post = sequelize.define(
    "Post",
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM("free", "notice", "operation"),
        allowNull: false,
        default: "user",
      },
    },
    {
      sequelize,
      timestamps: true,
      modelName: "Post",
      tableName: "posts",
      paranoid: true,
      underscored: true,
      charset: "utf8",
      collate: "utf8_general_ci",
    }
  );
  Post.associate = (models) => {
    Post.belongsTo(models.User, {
      foreignKey: {
        name: "userId",
        allowNull: false
      }
    });
  };
  return Post;
};
