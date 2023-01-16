import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { Op } from "sequelize";
import { UserModel } from "../../model/index.js";
import { BadRequestError } from "../../errors/httpErrors.js";
import { jwtConfig } from "../../config/config.js";

/**
 * 테이블에 username과 password가 같은 항목을 찾는(로그인을 위한) 메서드 : findUser
 * @param {string} username
 * @param {string} password
 * @returns
 * @throws {BadRequestError} username 또는 password를 찾지 못할 때 발생
 */
const findUser = async (username, password) => {
  const find = await UserModel.findOne({
    where: {
      username: username,
    },
  });
  if (!find) {
    throw new BadRequestError("username Error");
  }
  if (passwordsAreEqual(password, find.password)) {
    return find;
  } else {
    throw new BadRequestError("password Error");
  }
};

/**
 * bcrypt 모듈 내부에서 제공하는 비밀번호 비교 매서드
 * @param {string} enteredPassword
 * @param {string}  userPassword
 * @returns {boolean}
 */
const passwordsAreEqual = async (enteredPassword, userPassword) => {
  const bool = await bcrypt.compare(enteredPassword, userPassword);
  return bool;
};

/**
 * @todo 회원 생성 join 메서드
 * @param {string} name
 * @param {Date} birthday
 * @param {string} gender
 * @param {string} phoneNumber
 * @param {string} username
 * @param {string} password
 * @returns {}
 * @throws {BadRequestError} 가입을 위해 입력한 username 혹은 phoneNumber 가 이미 사용중일 때 발생
 */
export const join = async (
  name,
  username,
  birthday,
  gender,
  phoneNumber,
  password
) => {
  const validateUser = await validateUserId(username, phoneNumber);
  if (validateUser) {
    throw new BadRequestError("username or phoneNumber already exists");
  }
  const hash = await bcrypt.hash(password, 12);
  const newUser = await UserModel.create({
    name: name,
    username: username,
    password: hash,
    phoneNumber: phoneNumber,
    role: "user",
    gender: gender,
    birthday: birthday,
    lastLoginDate: new Date(), // 되나??
  });
  return newUser;
};

/**
 * @todo 회원 로그인 login 메서드
 * @param {string} username
 * @param {string} password
 * @returns {string} // login 성공시 사용자 정보 전달
 * @throws {BadRequestError} id(PK)를 통해서 조회되는 정보가 없는 경우(등록된 사용자가 없는 경우) 발생
 */
export const login = async (username, password) => {
  const correctUser = await findUser(username, password);
  if (correctUser) {
    await UserModel.update(
      { lastLoginDate: new Date() },
      {
        where: {
          id: correctUser.dataValues.id,
        },
      }
    );

    const jwtToken = jwt.sign(
      {
        id: correctUser.dataValues.id,
      },
      jwtConfig.secretKey,
      jwtConfig.option
    );
    return jwtToken;
  } else {
    throw new BadRequestError("cant find user");
  }
};

/**
 * 사용자 탈퇴
 * destore(시퀄에서 삭제 orm)사용하면 데이터 그대로 남고 deletedAt 만 쿼리날린 시간으로 업데이트
 * @param {string} username
 * @throws {BadRequestError}  username을 통해서 조회되는 정보가 없는 경우(등록된 사용자가 없는 경우) 발생
 */
export const deleteUser = async (username) => {
  const destroyResult = await UserModel.destroy({
    where: { username: username },
  });

  if (!destroyResult) {
    throw new BadRequestError(`${username} doesn't exist in user table`);
  }
};

/**
 * @todo 회원 권한변경 editUserRole 메서드
 * @param {string} username
 * @param {string} role
 * @returns
 * @throws {BadRequestError}  username을 통해서 조회되는 정보가 없는 경우(등록된 사용자가 없는 경우) 발생
 */
export const editUserRole = async (username, role) => {
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
 * @todo 회원 중복아이디 확인 validateUserId 메서드
 * @param {string} username
 * @returns {boolean}
 */
const validateUserId = async (username, phoneNumber) => {
  const du = await UserModel.findOne({
    where: {
      [Op.or]: [{ username: username }, { phoneNumber: phoneNumber }],
    },
  });
  return du;
};

/**
 * 성별별 통계
 * @param {string} gender
 */
export const findUserByGender = async (gender) => {
  const byGender = await UserModel.findAll({
    attributes: ["name", "username", "gender"],
    where: { gender: gender },
  });
  return byGender;
};
