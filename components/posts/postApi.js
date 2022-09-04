const express = require('express');
const { PostModel } = require('../../model');
const postService = require('../posts/postService');
const router = express.Router();
const postService = require('./postService');

// async middleware
const wrapAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next)
  }
}


/**
 * @description 운영게시판 Create
 * @param {String} 자원 URI 경로
 * @param {wrapAsync} 트라이캐치 핸들러
 */
router.post('/posts/operation', wrapAsync(postService.createPost));

/**
 * @description 운영게시판 Read(전체)
 * @param {String} 자원 URI 경로
 * @param {wrapAsync} 트라이캐치 핸들러
 */
router.get('/posts/operation', wrapAsync(postService.Controller));






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