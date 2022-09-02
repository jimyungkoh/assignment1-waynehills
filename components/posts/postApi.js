const express = require('express');
const postService = require('../posts/postService');
const router = express.Router();


// async middleware
const wrapAsyncCtrl = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next)
  }
}

// try catch Error handler

/**
 * @todo 운영게시판 CRUD
 */

// 운영게시판 생성
router.post('/posts/operation', isAdmin, async (req, res, next) => {
  try {
    // controller
  } catch (err) {
    next(err);
  }
})

// 운영게시판 전체 조회 (페이지네이션 적용, 검색 적용)
router.get('/posts/operation', isAdmin, async (req, res, next) => {
  const { page } = req.query;
  try {
    // controller
  } catch (err) {
    next(err);
  }
})

// 운영게시판 상세 조회
router.get('/posts/operation/:postId', isAdmin, async (req, res, next) => {
  const { postId } = req.params;
  try {
    // controller
  } catch (err) {
    next(err);
  }
})

// 운영게시판 수정
router.patch('/posts/operation/:postId', isAdmin, async (req, res, next) => {
  const { postId } = req.params;
  try {
    // controller
  } catch (err) {
    next(err);
  }
})

// 운영게시판 삭제
router.get('/posts/operation/:postId', isAdmin, async (req, res, next) => {
  const { postId } = req.params;
  try {
    // controller
  } catch (err) {
    next(err);
  }
})

/**
 * @todo 자유게시판 CRUD
 */

// 자유게시판 생성
router.post('/posts/free', async (req, res, next) => {
  try {
    // controller
  } catch (err) {
    next(err);
  }
})

// 자유게시판 전체 조회
router.get('/posts/free', async (req, res, next) => {
  try {
    // controller
  } catch (err) {
    next(err);
  }
})

// 자유게시판 상세 조회
router.get('/posts/free/:postId', async (req, res, next) => {
  const { postId } = req.params;
  try {
    // controller
  } catch (err) {
    next(err);
  }
})

// 자유게시판 수정
router.patch('/posts/free/:postId', async (req, res, next) => {
  const { postId } = req.params;
  try {
    // controller
  } catch (err) {
    next(err);
  }
})

// 자유게시판 삭제
router.get('/posts/free/:postId', async (req, res, next) => {
  const { postId } = req.params;
  try {
    // controller
  } catch (err) {
    next(err);
  }
})

/**
 * @todo 공지 CRUD
 */

// 공지 생성
router.post('/posts/notice', isAdmin, async (req, res, next) => {
  try {
    // controller
  } catch (err) {
    next(err);
  }
})

// 공지 전체 조회
router.get('/posts/notice', async (req, res, next) => {
  try {
    // controller
  } catch (err) {
    next(err);
  }
})

// 공지 상세 조회
router.get('/posts/notice/:postId', async (req, res, next) => {
  const { postId } = req.params;
  try {
    // controller
  } catch (err) {
    next(err);
  }
})

// 공지 수정
router.patch('/posts/notice/:postId', isAdmin, async (req, res, next) => {
  const { postId } = req.params;
  try {
    // controller
  } catch (err) {
    next(err);
  }
})

// 공지 삭제
router.get('/posts/notice/:postId', isAdmin, async (req, res, next) => {
  const { postId } = req.params;
  try {
    // controller
  } catch (err) {
    next(err);
  }
})

module.exports = router;