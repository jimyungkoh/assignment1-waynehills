const express = require('express');
const userService = require('../users/userService');

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


/***
 * @todo 회원 로그인 기능 구현
 */

/**
 * @todo 회원 삭제하기
 * */

module.exports = router;
