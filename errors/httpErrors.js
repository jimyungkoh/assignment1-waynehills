class BasicError extends Error {
  constructor(name, message, statusCode) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
    this.isCustom = true;
  }
}

/**
 * 서버가 클라이언트 오류를 감지해 요청을 처리할 수 없는 상태
 * 클라이언트는 요청을 수정하지 않고 동일한 형태로 다시 보내서는 안됩니다.
 */
class BadRequestError extends BasicError {
  constructor(message) {
    super("BadRequestError", message, 400);
  }
}

//해당 리소스에 유효한 인증 자격 증명이 없기 때문에 요청이 적용되지 않은 상태
class UnauthorizedError extends BasicError {
  constructor(message) {
    super("Unauthorized", message, 401);
  }
}

// 서버에 요청이 전달되었지만, 권한 때문에 거절된 상태
class ForbiddenError extends BasicError {
  constructor(message) {
    super("Forbidden", message, 403);
  }
}

// 서버가 요청받은 리소스를 찾을 수 없는 상태
class NotFoundError extends BasicError {
  constructor(message) {
    super("NotFoundError", message, 404);
  }
}

// 요청 방법이 서버에 의해 알려졌으나, 사용 불가능한 상태
class MethodNotAllowedError extends BasicError {
  constructor(message) {
    super("MethodNotAllowedError", message, 405);
  }
}

module.exports = {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  MethodNotAllowedError,
};
