const express = require("express");
const userService = require("../users/userService");

const router = express.Router();

/**
 * 예시: 회원 삭제하기
 * router.delete('/:user_id', async (req, res, next) => {
 *   const user_id = req.params.user_id;
 *   try {
 *     await openingService.validateOpeningId(user_id);
 *
 *     await openingService.delete(user_id);
 *
 *     res.status(200).json({
 *       success: true,
 *       message: `${user_id} was deleted successfully.`
 *     });
 *   } catch (e) {
 *     next(e);
 *   }
 * });
 * */

/**
 * @todo 회원 등록하기
 * */

router.post("/signUp", async (req, res, next) => {
  const { name, birthday, gender, phoneNumber, username, password } = req.body;
  try {
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
 * @todo 회원 로그인 기능 구현
 */

router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const token = await userService.login(username, password);

    res.token = token;
    res.status(201).json({
      message: `로그인이 완료되었습니다.`,
    });
  } catch (e) {
    next(e);
  }
});

/**
 * @todo 회원 삭제하기
 * */

router.delete("/delete", async (req, res, next) => {
  const username = req.user.username;

  try {
    await userService.deleteUser(username);

    res.status(201).json({
      success: true,
      message: `회원탈퇴가 완료되었습니다.`,
    });
  } catch (e) {
    next(e);
  }
});

/**
 * @todo 회원 등급변경
 * */

router.patch("/role", async (req, res, next) => {
  const { username, role } = req.body;

  try {
    await userService.editUserRole(username, role);

    res.status(201).json({
      success: true,
      message: `${username}의 회원 등급 변경이 완료되었습니다.`,
    });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
