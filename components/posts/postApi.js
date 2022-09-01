const express = require('express');
const postService = require('../posts/postService');

const router = express.Router();

module.exports = router;

/**
 * 예시: 게시글 삭제하기
 *
 * router.delete('/:id', async (req, res, next) => {
 *   const id = req.params.id;
 *   try {
 *     await postService.validateOpeningId(id);
 *
 *     await postService.delete(id);
 *
 *     res.status(200).json({
 *       success: true,
 *       message: `${id} was deleted successfully.`
 *     });
 *   } catch (e) {
 *     next(e);
 *   }
 * });
 */

/**
 * @todo 운영게시판 게시글 작성하기
 */

/**
 * @todo 운영게시판 게시글 모두 조회하기
 */

/**
 * @todo 운영게시판 게시글 단건 조회하기
 */

/**
 * @todo 운영게시판 게시글 삭제하기
 */

/**
 * @todo 공지사항 게시글 작성하기
 */

/**
 * @todo 공지사항 게시글 모두 조회하기
 */

/**
 * @todo 공지사항 게시글 단건 조회하기
 */

/**
 * @todo 공지사항 게시글 삭제하기
 */

/**
 * @todo 자유게시판 게시글 작성하기
 */

/**
 * @todo 자유게시판 게시글 모두 조회하기
 */

/**
 * @todo 자유게시판 게시글 단건 조회하기
 */

/**
 * @todo 자유게시판 게시글 삭제하기
 */

module.exports = router;
