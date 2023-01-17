import express from "express";
import * as userService from "../users/userService.js";
import { userAuthChecker } from "../../middlewares/userAuthChecker.js";

const router = express.Router();

/**
 * @description 회원 등록하기
 * */
router.post("/join", async (req, res, next) => {
  const userInfo = {
    name: req.body.name,
    username: req.body.username,
    birthday: req.body.birthday,
    gender: req.body.gender,
    phoneNumber: req.body.phoneNumber,
    password: req.body.password,
  };

  await userService
    .join(userInfo)
    .then(() =>
      res.status(201).json({
        success: true,
        message: `회원가입이 완료되었습니다.`,
      })
    )
    .catch((err) => next(err));
});

/***
 * @description 회원 로그인 기능 구현
 */
router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  await userService
    .login(username, password)
    .then((token) =>
      res.status(201).json({
        message: `로그인이 완료되었습니다.`,
        token,
      })
    )
    .catch((err) => next(err));
});

/**
 * @description 회원 삭제하기
 * */

router.delete(
  "/delete",
  userAuthChecker(["admin", "user"]),
  async (req, res, next) => {
    const username = req.userInfo.username;

    await userService
      .deleteUser(username)
      .then(() =>
        res.status(200).json({
          success: true,
          message: `회원탈퇴가 완료되었습니다.`,
        })
      )
      .catch((err) => next(err));
  }
);

/**
 * @description 회원 등급변경
 * */

router.patch("/role", userAuthChecker(["admin"]), async (req, res, next) => {
  const { username, role } = req.body;
  await userService
    .updateUserRole(username, role)
    .then(() =>
      res.status(200).json({
        success: true,
        message: `${username}의 회원 등급 변경이 완료되었습니다.`,
      })
    )
    .catch((err) => next(err));
});

router.get("/userStats", async (req, res, next) => {
  const { gender } = req.body;
  await userService
    .findUserByGender(gender)
    .then((getGender) =>
      res.status(200).json({
        getGender,
      })
    )
    .catch((err) => next(err));
});

export { router };
