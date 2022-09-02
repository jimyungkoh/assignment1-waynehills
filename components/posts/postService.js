const {UserModel, PostModel} = require("../../model");

/**
 * NotFoundError: 원하는 id값을 조회할 수 없는 경우
 * BadRequestError: create or update 메서드를 날릴 때 원하지 않는 객체가 들어온 경우
 * ForbiddenError:  없는 경우
 * */
const {NotFoundError, BadRequestError, ForbiddenError} = require('../../errors/httpErrors');

// 0: free, 1: notice, 2: operation
const postType = PostModel.getAttributes().type.values;
const FREE = postType[0];
const NOTICE = postType[1];
const OPERATION = postType[2];

// 0: user, 1: admin
const userRoles = UserModel.getAttributes().role.values;
const USER = userRoles[0];
const ADMIN = userRoles[1];

/**
 * @description 게시글 입력 값 유효성 확인
 * @param {Object} post
 * @throws {BadRequestError}
 */
const validatePostFields = (post) => {
  if (post.title === "" || post.type === "" || post.content === "") {
    throw new BadRequestError('입력 값이 유효하지 않습니다.');
  }
}

/**
 * @description 유저는 운영, 공지사항 게시판 작성 권한 없음
 * @param {string} userRole
 * @param {string} postType
 * @throws {ForbiddenError}
 */
const hasRoleToPost = (userRole, postType) => {
  if (userRole === USER && postType !== FREE) {
    throw ForbiddenError('게시판 접근 권한이 없는 유저입니다');
  }
}

/**
 * @description 게시글 등록 메서드
 * @param {Object} post HTTP post 메서드로 전달받을 req.body
 * @param {number} userId 유저 id
 * @param {string} post.title 게시글 제목
 * @param {string} post.content 게시글 내용
 * @param {string} post.type 게시판 타입 (운영 게시판|공지|자유 게시판)
 * @throws {ForbiddenError} 게시판에 게시 권한이 없는 유저
 * @throws {BadRequestError} 원하지 않는 값이 들어왔을 때
 */
exports.createPost = async (post, userId) => {

  const user = await UserModel.findByPk(1);

  hasRoleToPost(user.role, post.type);
  validatePostFields(post);

  /**
   * @type {{
   *  updated_at: Date,
   *  created_at: Date,
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
    username: userId
  };

  return PostModel.create(newPost);
}
