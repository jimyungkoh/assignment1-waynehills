const userService = require("../components/users/userService");
const { BadRequestError, ForbiddenError } = require("../errors/httpErrors");
const UserModel = require("../model/index");

/**
 * @description 토큰이 유효한 요청에 권한을 확인하고 유저 정보를 추가하는 미들웨어
 * @param role 요구되는 회원등급
 */

const userAuthChecker = (role) => {
  return async (req, res, next) => {
    const JWT = req.headers.authorization;
    try {
      const userId = await userService.verify(JWT); // 토큰 복호화
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
