const { BadRequestError, ForbiddenError } = require("../errors/httpErrors");
const UserModel = require("../model/index");
const { jwtConfig } = require("../config/config");
const jwt = require("jsonwebtoken");

/**
 * jwt.verify 오류 처리를 위해 분리한 함수
 * @param {string} token jwt 토큰을 받아옵니다.
 * @returns {int}
 */
const verify = async (token) => {
  try {
    const decoded = await jwt.verify(token, jwtConfig.secretKey, jwtConfig.option);
    return decoded;
  } catch (err) {
    if (err.message === "jwt expired") {
        throw new UnauthorizedError("Jwt token is expired");
    } else if (err.message === 'jwt signature is required') {
        throw new UnauthorizedError("Jwt signature is required");
    } else if (err.message === 'jwt malformed') {
        throw new UnauthorizedError("Jwt verify function does not have three components");
    } else if (err.message === 'invalid signature') {
        throw new UnauthorizedError("Jwt Signature is invalid");
    } else if (err.message === 'jwt audience invalid. expected: [OPTIONS AUDIENCE]') {
        throw new UnauthorizedError("Jwt Audience is invalid");
    } else if (err.message === 'jwt id invalid. expected: [OPTIONS JWT ID]') {
        throw new UnauthorizedError("Jwt id is invalid");
    } else if (err.message === 'jwt issuer invalid. expected: [OPTIONS ISSUER]') {
        throw new UnauthorizedError("Jwt issuer is invalid");
    } else if (err.message === 'jwt subject invalid. expected: [OPTIONS SUBJECT]') {
        throw new UnauthorizedError("Jwt subject is invalid");
    } else if (err.message === 'jwt not active') {
        throw new UnauthorizedError("Jwt is not active");
    } else (err.message === 'invalid token') {
        throw new UnauthorizedError("Jwt token is invalid");
    }
  }
};

/**
 * @description 토큰이 유효한 요청에 권한을 확인하고 유저 정보를 추가하는 미들웨어
 * @param {Array} roles 접근가능 회원등급 배열
 */
const userAuthChecker = (roles) => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization;
      const userId = await verify(token); // 토큰 복호화
      const userInfo = await UserModel.findByPk(userId); // 복호화된 Id를 통해 유저 정보 얻기
      if (!userInfo) {
        throw new BadRequestError(`Can't find user`);
      }
      if (!roles.includes(user.role)) {
        throw new ForbiddenError(`User doesn't have authorization`);
      }
      req.userInfo = userInfo;
      next();
    } catch (err) {
      next(err);
    }
  };
};

module.exports = { userAuthChecker };
