const { UserModel, PostModel } = require("../../model");
const {
  NotFoundError,
  BadRequestError,
  ForbiddenError,
} = require("../../errors/httpErrors");
const { Op } = require("sequelize");

// 0: free, 1: notice, 2: operation
const postTypes = PostModel.getAttributes().type.values;
const [postTypeFree, postTypeOperation] = postTypes;

// 0: user, 1: admin
const [userRoleUser, userRoleAdmin] = UserModel.getAttributes().role.values;

/**
 * @description 입력한 게시판이 테이블에 존재하는 게시판인지 확인합니다.
 * @param {string} postType 게시판 종류
 * @throws {NotFoundError} 입력된 게시판 종류가 테이블에 존재하지 않음
 * @returns {boolean} 게시판 유효성 검사 확인 걸과
 */
const validatePostType = (postType) => {
  if (postTypes.includes(postType)) {
    throw new NotFoundError("This postType doesn't exist in posts.type");
  }

  return true;
};

/**
 * @description 게시글 입력 값의 유효성을 확인합니다.
 * @param {Object} post 게시글 입력 값
 * @throws {BadRequestError} 제목 | 게시판 종류 | 내용이 입력되지 않음
 * @returns {boolean} 유효성 검사 결과
 */
const validatePostFields = (post) => {
  const { title, type, content } = post;

  if (!title || !type || !content) {
    throw new BadRequestError("Post values cannot be empty");
  }

  return true;
};

/**
 * @description 유저가 게시글 작성 권한을 가졌는지 확인합니다.
 * @param {string} userRole 유저의 권한
 * @param {string} postType 게시판 종류
 * @throws {ForbiddenError} 게시글 작성 권한이 없는 유저
 * @return {boolean} 게시글 작성 권한 확인 결과
 */
const hasRoleToPost = (userRole, postType) => {
  if (userRole === userRoleUser && postType !== postTypeFree) {
    throw ForbiddenError(
      "Access denied You are not authorized to access this page"
    );
  }

  return true;
};

/**
 * @description 유저의 게시글 수정, 삭제 권한을 확인합니다.
 * @param {string} userRole 유저의 권한
 * @param {number} expectedUserId 현재 접속한 유저의 id
 * @param {number} actualUserId 게시글을 작성한 유저의 id
 * @throws {ForbiddenError} 유저는 해당 게시글 수정, 삭제 권한이 없음
 * @returns {boolean} 게시글 수정, 삭제 권한을 확인 결과
 */
const hasRoleToUpdateOrDelete = (userRole, expectedUserId, actualUserId) => {
  if (userRole === userRoleUser && expectedUserId !== actualUserId) {
    throw new ForbiddenError(
      "Access denied You are not authorized to update or delete this post."
    );
  } else {
    return true;
  }
};

/**
 * @description 유저의 읽기 권한을 확인합니다.
 * @param {string} userRole 유저의 권한
 * @param {string} postType 게시판 종류
 * @throws {ForbiddenError} 읽기 권한이 없는 유저
 * @returns {boolean} 읽기 권한 확인 결과
 */
const hasRoleToRead = (userRole, postType) => {
  if (userRole !== userRoleAdmin && postType === postTypeOperation) {
    throw new ForbiddenError(
      `${userRole} doesn't have a Permission to read ${postType}`
    );
  }

  return true;
};

/**
 * @description 게시글 등록 메서드
 * @param {Object} post HTTP post 메서드로 전달받을 req.body
 * @param {number} userId 유저 id
 * @param {string} post.title 게시글 제목
 * @param {string} post.content 게시글 내용
 * @param {string} post.type 게시판 타입 (운영 게시판|공지|자유 게시판)
 * @throws {ForbiddenError} 게시판에 게시 권한이 없는 유저
 * @throws {BadRequestError} 원하지 않는 값이 들어왔을 때
 * @returns {Promise<Object>}
 */
exports.createPost = async (post, userId) => {
  const user = await UserModel.findByPk(userId).catch((err) => {
    throw new Error(err);
  });

  // eslint-disable-next-line no-undef
  await Promise.all([
    validatePostType(post.type),
    hasRoleToPost(user.role, post.type),
    validatePostFields(post),
  ]);

  /**
   * @type {{
   *  title: string,
   *  type: string,
   *  username: string,
   *  content: string
   * }}
   */
  const newPost = {
    title: post.title,
    content: post.content,
    type: post.type,
    username: user.username,
  };

  return PostModel.create(newPost);
};

/**
 * @description postId에 해당하는 post를 반환합니다.
 * @param {number} postId 포스트 id
 * @param {number} userId 유저 id
 * @returns {Promise<Object>}
 */
exports.readOnePost = async (postId, userId) => {
  const user = await UserModel.findByPk(userId).catch((err) => {
    throw new Error(err);
  });

  const post = await PostModel.findByPk(postId, {
    raw: true,
  }).catch((err) => {
    throw new Error(err);
  });

  // eslint-disable-next-line no-undef
  hasRoleToRead(user.role, post.type);

  if (!post) throw new NotFoundError(`${postId} doesn't exist in posts`);

  return post;
};

/**
 * @description 게시판에 맞추어 여러 개의 포스트를 반환합니다.
 * @param userId 유저 id
 * @param postType 게시판 유형
 * @param skip page * pageSize
 * @param limit pageSize
 * @returns {Promise<Object>}
 */
exports.readPostsByType = async (userId, postType, skip, limit) => {
  const user = await UserModel.findByPk(userId).catch((err) => {
    throw new Error(err);
  });

  hasRoleToRead(user.role, postType);

  return await PostModel.findAll({
    raw: true,
    offset: skip,
    limit: limit,
    attributes: { exclude: ["content"] },
  });
};

/**
 * @description 관리자가 호출 가능한 모든 포스트 가져오기 메서드입니다.
 * @param userId 유저의 id
 * @param skip @param userId
 * @param limit pageSize
 * @returns {Promise<Object>}
 */
exports.readAllPost = async (userId, skip, limit) => {
  const user = UserModel.findByPk(userId).catch((err) => {
    throw new Error(err);
  });

  hasRoleToRead(user.role, postTypeOperation);

  return await PostModel.findAll({
    raw: true,
    offset: skip,
    limit: limit,
    attributes: { exclude: ["content"] },
  }).catch((err) => {
    throw new Error(err);
  });
};
