const { BadRequestError, ForbiddenError } = require("../errors/httpErrors");
const UserModel = require("../model/index");
const { secretKey, option } = require("../config/config");
const jwt = require("jsonwebtoken");

/**
 * @description 토큰이 유효한 요청에 권한을 확인하고 유저 정보를 추가하는 미들웨어
 * @param roles 요구되는 회원등급 배열
 */
const userAuthChecker = (roles) => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization;
      const userId = await jwt.verify(token, secretKey, option); // 토큰 복호화
      const user = await UserModel.findByPk(userId); // 복호화된 Id를 통해 유저 정보 얻기
      if (!user) {
        throw new BadRequestError(`Can't find user`);
      }
      if (!roles.includes(user.role)) {
        throw new ForbiddenError(`User doesn't have authorization`);
      }
      req.user = user;
      next();
    } catch (e) {
      next(e);
    }
  };
};

module.exports = { userAuthChecker };
