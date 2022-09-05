const express = require('express');
const router = express.Router();
const postService = require('./postService');
const { userAuthChecker } = require('../../middlewares/userAuthChecker');

/**
 * @description 운영게시판 생성(Create)
 * @description POST /posts/operation
 */
router.post('/operation', async (req, res, next) => {
  const { title, content, type } = req.body;
  try {
    await postService.createPost({
      title,
      content,
      type,
    }, user);
    res.status(201).json({
      success: true,
      message: `운영게시판 생성이 완료되었습니다.`,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @description 운영게시판 전체 조회(Read)
 * @description GET /posts/operation?skip=1&limit=10
 */
router.get('/operation', async (req, res, next) => {
  const { skip, limit } = req.query;
  const postType = 'operation';
  try {
    // 검색 X
    await postService.readPostsByType(user, postType, skip, limit)
      .then(result => {
        res.status(200).json(result);
      }); 
  } catch (err) {
    next(err);
  }
});


/**
 * @description 운영게시판 상세 조회(Read)
 * @description GET /posts/operation/{postId}
 */
router.patch('/operation/:postId', async (req, res, next) => {
  const { postId } = req.params;
  try {
    await postService.readPost(postId, user)
      .then(result => {
        res.status(200).json(result);
      });
  } catch (err) {
    next(err);
  }
});

/**
 * @description 운영게시판 수정(Update)
 * @description PATCH /posts/operation/{postId}
 */
router.get('/operation/:postId', async (req, res, next) => {
  const { postId } = req.params;
  try {
    await postService.readPost(postId, user)
      .then(result => {
        res.status(200).send(`'${postId}'번 글이 수정되었습니다.`);
      });
  } catch (err) {
    next(err);
  }
});

/**
 * @description 운영게시판 삭제(Delete)
 * @description DELETE /posts/operation/{postId}
 */
router.delete('/operation/:postId', async (req, res, next) => {
  const { postId } = req.params;
  try {
    await postService.readPost(postId, user)
      .then(result => {
        res.status(200).send(`'${postId}'번 글이 삭제되었습니다.`);
      });
  } catch (err) {
    next(err);
  }
});

module.exports = router;