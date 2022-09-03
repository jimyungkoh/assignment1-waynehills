const { BadRequestError, ForbiddenError } = require("../errors/httpErrors");
const UserModel = require("../model/index");
const { secretKey, option } = require("../config/config");
const jwt = require("jsonwebtoken");

/**
 * 토큰을 통해 다시 사용자id를 불러오는 메서드 : verify
 * @param {string} token
 * @returns {int}
 */
const verify = async (token) => {
  let decoded;
  try {
    decoded = await jwt.verify(token, secretKey, option);
  } catch (err) {
    if (err.message === "jwt expired") {
      console.log("expired token");
      return "TOKEN_EXPIRED";
    } else {
      console.log("invalid token");
      return "TOKEN_INVALID";
    }
  }

  return decoded;
};

/**
 * @description 토큰이 유효한 요청에 권한을 확인하고 유저 정보를 추가하는 미들웨어
 * @param role 요구되는 회원등급
 */
const userAuthChecker = (role) => {
  return async (req, res, next) => {
    const JWT = req.headers.authorization;
    try {
      const userId = await verify(JWT); // 토큰 복호화
      const user = await UserModel.findByPk(userId); // 복호화된 Id를 통해 유저 정보 얻기
      if (!user) {
        throw new BadRequestError(`can't find user`);
      }
      if (user.role != role) {
        throw new ForbiddenError(`doesn't have enough authorization`);
      }
      req.user = user;
      next();
    } catch (e) {
      next(e);
    }
  };
};

module.exports = { userAuthChecker };
