import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import { UserModel } from "../../model/index.js";
import { BadRequestError } from "../../errors/httpErrors.js";
import { jwtConfig } from "../../config/config.js";

/**
 * @todo 회원 생성 join 메서드
 * @param {Object} userInfo
 * @returns {Promise<UserModel>}
 * @throws {BadRequestError} 가입을 위해 입력한 username 혹은 phoneNumber 가 이미 사용중일 때 발생
 */
export const join = async (userInfo) => {
  return await checkDuplicateUser(userInfo)
    .then(() => {
      return bcrypt.hash(userInfo.password, 12);
    })
    .then((hashedPassword) => {
      userInfo.password = hashedPassword;
      userInfo.role = "user";
      userInfo.lastLoginDate = new Date(); // 되나?
    })
    .then(() => {
      return UserModel.create(userInfo);
    });
};

/**
 * @todo 회원 로그인 login 메서드
 * @param {string} username
 * @param {string} password
 * @returns {Promise<string>} // login 성공시 사용자 정보 전달
 * @throws {BadRequestError} id(PK)를 통해서 조회되는 정보가 없는 경우(등록된 사용자가 없는 경우) 발생
 */
export const login = async (username, password) => {
  return await findUser(username)
    .then((user) => {
      checkPassword(password, user.dataValues.password);
      return user;
    })
    .then((user) => {
      updateLoginTime(user);
      return user;
    })
    .then((user) => getToken(user.dataValues.id));
};

/**
 * 사용자 탈퇴
 * destore(시퀄에서 삭제 orm)사용하면 데이터 그대로 남고 deletedAt 만 쿼리날린 시간으로 업데이트
 * @param {string} username
 * @throws {BadRequestError}  username을 통해서 조회되는 정보가 없는 경우(등록된 사용자가 없는 경우) 발생
 */
export const deleteUser = async (username) => {
  await UserModel.destroy({
    where: { username: username },
  }).then((result) => {
    if (!result) {
      throw new BadRequestError(`${username} doesn't exist in user table`);
    }
  });
};

/**
 * @todo 회원 권한변경 editUserRole 메서드
 * @param {string} username
 * @param {string} role
 * @returns
 * @throws {BadRequestError}  username을 통해서 조회되는 정보가 없는 경우(등록된 사용자가 없는 경우) 발생
 */
export const changeUserRole = async (username, role) => {
  await UserModel.update(
    { role: role },
    {
      where: {
        username: username,
      },
    }
  );
};

/**
 * 성별별 통계
 * @param {string} gender
 */
export const findUserByGender = async (gender) => {
  return await UserModel.findAll({
    attributes: ["name", "username", "gender"],
    where: { gender: gender },
  });
};

/**
 * 테이블에 username과 password가 같은 항목을 찾는(로그인을 위한) 메서드 : findUser
 * @param {string} username
 * @returns {Promise<UserModel>}
 * @throws {BadRequestError} username 또는 password를 찾지 못할 때 발생
 */
const findUser = async (username) => {
  return await UserModel.findOne({
    where: {
      username: username,
    },
  }).then((user) => {
    if (!user) throw new BadRequestError("username Error");
    return user;
  });
};

/**
 * bcrypt 모듈 내부에서 제공하는 비밀번호 비교 매서드
 * @param {string} enteredPassword
 * @param {string}  userPassword
 * @returns {boolean}
 */
const checkPassword = (enteredPassword, userPassword) => {
  if (!bcrypt.compare(enteredPassword, userPassword)) {
    throw new BadRequestError("password Error");
  }
};

/**
 * @todo 회원 중복아이디 확인 checkDuplicateUser 메서드
 * @param {Object} user
 * @throws {BadRequestError}
 * @returns Promise<void>
 */
const checkDuplicateUser = async (user) => {
  await UserModel.findOne({
    where: {
      [Op.or]: [{ username: user.username }, { phoneNumber: user.phoneNumber }],
    },
  }).then((user) => {
    if (user) {
      throw new BadRequestError("username or phoneNumber already exists");
    }
  });
};

/**
 * 유저 로그인 토큰 발급
 * @param {string} userId
 * @returns {string} token
 * */
const getToken = (userId) => {
  return jwt.sign(
    {
      id: userId,
    },
    jwtConfig.secretKey,
    jwtConfig.option
  );
};

const updateLoginTime = async (user) => {
  await UserModel.update(
    { lastLoginDate: new Date() },
    {
      where: {
        id: user.dataValues.id,
      },
    }
  );
};
