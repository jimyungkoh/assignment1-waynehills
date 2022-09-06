const express = require("express");
const router = express.Router();
const postService = require("./postService");
const { userAuthChecker } = require("../../middlewares/userAuthChecker");

/**
 * @description 운영게시판 생성(Create)
 * @description POST /posts/operation
 */
router.post(
  "/operation",
  userAuthChecker(["admin"]),
  async (req, res, next) => {
    const post = req.body;
    const user = req.userInfo;
    try {
      await postService.createPost(post, user);
      res.status(201).json({
        success: true,
        message: `운영 게시판 게시글 작성이 완료되었습니다.`,
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * @description 운영게시판 전체 조회(Read)
 * @description GET /posts/operation?skip=1&limit=10
 */
router.get("/operation", userAuthChecker(["admin"]), async (req, res, next) => {
  const { skip, limit } = req.query;
  const user = req.userInfo;
  const postType = "operation";
  try {
    await postService
      .readPostsByType(user, postType, skip, limit)
      .then((result) => {
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
router.get(
  "/operation/:postId",
  userAuthChecker(["admin"]),
  async (req, res, next) => {
    const { postId } = req.params;
    const user = req.userInfo;
    try {
      await postService.readPost(postId, user).then((result) => {
        res.status(200).json(result);
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * @description 운영게시판 수정(Update)
 * @description PATCH /posts/operation/{postId}
 */
router.patch(
  "/operation/:postId",
  userAuthChecker(["admin", "user"]),
  async (req, res, next) => {
    const { postId } = req.params;
    const user = req.userInfo;
    const newPost = req.body;
    try {
      await postService.updatePost(postId, newPost, user).then((result) => {
        res.status(200).send(`'${postId}'번 글이 수정되었습니다.`);
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * @description 운영게시판 삭제(Delete)
 * @description DELETE /posts/operation/{postId}
 */
router.delete(
  "/operation/:postId",
  userAuthChecker(["admin"]),
  async (req, res, next) => {
    const { postId } = req.params;
    const user = req.userInfo;
    try {
      await postService.deletePost(postId, user).then((result) => {
        res.status(200).send(`'${postId}'번 글이 삭제되었습니다.`);
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * @description 자유게시판 생성(Create)
 * @description POST /posts/free
 */
router.post(
  "/free",
  userAuthChecker(["admin", "user"]),
  async (req, res, next) => {
    const post = req.body;
    const user = req.userInfo;
    try {
      await postService.createPost(post, user);
      res.status(201).json({
        success: true,
        message: `자유 게시판 게시글 작성이 완료되었습니다.`,
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * @description 자유게시판 전체 조회(Read)
 * @description GET /posts/free?skip=1&limit=10
 */
router.get(
  "/free",
  userAuthChecker(["admin", "user"]),
  async (req, res, next) => {
    const { skip, limit } = req.query;
    const user = req.userInfo;
    const postType = "free";
    try {
      await postService
        .readPostsByType(user, postType, skip, limit)
        .then((result) => {
          res.status(200).json(result);
        });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * @description 자유게시판 상세 조회(Read)
 * @description GET /posts/free/{postId}
 */
router.get(
  "/free/:postId",
  userAuthChecker(["admin", "user"]),
  async (req, res, next) => {
    const { postId } = req.params;
    const user = req.userInfo;
    try {
      await postService.readPost(postId, user).then((result) => {
        res.status(200).json(result);
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * @description 자유게시판 수정(Update)
 * @description PATCH /posts/free/{postId}
 */
router.patch(
  "/free/:postId",
  userAuthChecker(["admin", "user"]),
  async (req, res, next) => {
    const { postId } = req.params;
    const user = req.userInfo;
    const newPost = req.body;
    try {
      await postService.updatePost(postId, newPost, user).then((result) => {
        res.status(200).send(`'${postId}'번 글이 수정되었습니다.`);
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * @description 자유게시판 삭제(Delete)
 * @description DELETE /posts/free/{postId}
 */
router.delete(
  "/free/:postId",
  userAuthChecker(["admin", "user"]),
  async (req, res, next) => {
    const { postId } = req.params;
    const user = req.userInfo;
    try {
      await postService.deletePost(postId, user).then((result) => {
        res.status(200).send(`'${postId}'번 글이 삭제되었습니다.`);
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * @description 공지 생성(Create)
 * @description POST /posts/notice
 */
router.post("/notice", userAuthChecker(["admin"]), async (req, res, next) => {
  const post = req.body;
  const user = req.userInfo;
  try {
    await postService.createPost(post, user);
    res.status(201).json({
      success: true,
      message: `공지 게시판 게시글 작성이 완료되었습니다.`,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @description 공지 전체 조회(Read)
 * @description GET /posts/notice?skip=1&limit=10
 */
router.get(
  "/notice",
  userAuthChecker(["admin", "user"]),
  async (req, res, next) => {
    try {
      const user = req.userInfo;
      const postType = "notice";
      const { skip, limit } = req.query;
      await postService
        .readPostsByType(user, postType, skip, limit)
        .then((result) => {
          res.status(200).json(result);
        });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * @description 공지 상세 조회(Read)
 * @description GET /posts/notice/{postId}
 */
router.get(
  "/notice/:postId",
  userAuthChecker(["admin"]),
  async (req, res, next) => {
    const { postId } = req.params;
    const user = req.userInfo;
    try {
      await postService.readPost(postId, user).then((result) => {
        res.status(200).json(result);
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * @description 공지 수정(Update)
 * @description PATCH /posts/notice/{postId}
 */
router.patch(
  "/notice/:postId",
  userAuthChecker(["admin"]),
  async (req, res, next) => {
    const { postId } = req.params;
    const user = req.userInfo;
    const newPost = req.body;
    try {
      await postService.updatePost(postId, newPost, user).then((result) => {
        res.status(200).send(`'${postId}'번 글이 수정되었습니다.`);
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * @description 공지 삭제(Delete)
 * @description DELETE /posts/notice/{postId}
 */
router.delete(
  "/notice/:postId",
  userAuthChecker(["admin"]),
  async (req, res, next) => {
    const { postId } = req.params;
    const user = req.userInfo;
    try {
      await postService.deletePost(postId, user).then((result) => {
        res.status(200).send(`'${postId}'번 글이 삭제되었습니다.`);
      });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
