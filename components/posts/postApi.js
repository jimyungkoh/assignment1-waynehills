const express = require('express');
const { PostModel } = require('../../model');
const router = express.Router();
const postService = require('./postService');

// async middleware
const wrapAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next)
  }
}


/**
 * @description 운영게시판 생성(Create)
 */
router.post('/posts/operation', wrapAsync(postService.createPost));

/**
 * @description 운영게시판 전체 조회(Read)
 */
router.get('/posts/operation', wrapAsync(postService.readPosts));

/**
 * @description 운영게시판 상세 조회(Read)
 */
router.get('/posts/operation/:postId', wrapAsync(postService.readPost));

/**
 * @description 운영게시판 수정(Update)
 */
router.get('/posts/operation/:postId', wrapAsync(postService.updatePost));

/**
 * @description 운영게시판 삭제(Delete)
 */
router.get('/posts/operation/:postId', wrapAsync(postService.deletePost));


/**
 * @description 자유게시판 생성(Create)
 */
router.post('/posts/free', wrapAsync(postService.createPost));

/**
 * @description 자유게시판 전체 조회(Read)
 */
router.get('/posts/free', wrapAsync(postService.readPosts));

/**
 * @description 자유게시판 상세 조회(Read)
 */
router.get('/posts/free/:postId', wrapAsync(postService.readPost));

/**
 * @description 자유게시판 수정(Update)
 */
router.get('/posts/free/:postId', wrapAsync(postService.updatePost));

/**
 * @description 자유게시판 삭제(Delete)
 */
router.get('/posts/free/:postId', wrapAsync(postService.deletePost));


/**
 * @description 공지 생성(Create)
 */
router.post('/posts/notice', wrapAsync(postService.createPost));

/**
 * @description 공지 전체 조회(Read)
 */
router.get('/posts/notice', wrapAsync(postService.readPosts));

/**
 * @description 공지 상세 조회(Read)
 */
router.get('/posts/notice/:postId', wrapAsync(postService.readPost));

/**
 * @description 공지 수정(Update)
 */
router.get('/posts/notice/:postId', wrapAsync(postService.updatePost));

/**
 * @description 공지 삭제(Delete)
 */
router.get('/posts/notice/:postId', wrapAsync(postService.deletePost));





// 운영게시판 전체 조회 (페이지네이션 적용, 검색 적용)
// posts/operation?page=1&pageSize=5
router.get('/posts/operation', pagiNation, wrapAsync(async (req, res, next) => {
  const pageInfo = req.query;
  if (!page) {
    // 쿼리가 없는 경우
  } else {
    // 쿼리가 있는 경우
    const page = parseInt(pageInfo.page);
    const pageSize = parseInt(pageInfo.pageSize);
  }
}))

module.exports = router;