const express = require("express");
const userService = require("../users/userService");
const userStatsService = require('./userStatsService')
const router = express.Router();

/**
 * @description 회원 등록하기
 * */

router.post("/signUp", async (req, res, next) => {
  try {
    const { name, birthday, gender, phoneNumber, username, password } =
      req.body;
    await userService.signUp(
      name,
      username,
      birthday,
      gender,
      phoneNumber,
      password
    );

    res.status(201).json({
      success: true,
      message: `회원가입이 완료되었습니다.`,
    });
  } catch (e) {
    next(e);
  }
});

/***
 * @description 회원 로그인 기능 구현
 */

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const token = await userService.login(username, password);

    res.status(201).json({
      message: `로그인이 완료되었습니다.`,
      token: token,
    });
  } catch (e) {
    next(e);
  }
});

/**
 * @description 회원 삭제하기
 * */

router.delete("/delete", async (req, res, next) => {
  try {
    const username = req.user.username;
    await userService.deleteUser(username);

    res.status(200).json({
      success: true,
      message: `회원탈퇴가 완료되었습니다.`,
    });
  } catch (e) {
    next(e);
  }
});

/**
 * @description 회원 등급변경
 * */

router.patch("/role", async (req, res, next) => {
  try {
    const { username, role } = req.body;
    await userService.editUserRole(username, role);

    res.status(200).json({
      success: true,
      message: `${username}의 회원 등급 변경이 완료되었습니다.`,
    });
  } catch (e) {
    next(e);
  }
});


module.exports = router;
