// error를 콘솔로그에 출력합니다
const errorLogger = (err, req, res, next) => {
  next(err);
};

const errorResponder = (err, req, res, next) => {
  const { statusCode, message, isCustom } = err;
  // 코드에서 캐치한 에러는 statusCode와 message를 반환 합니다.
  if (isCustom) {
    res.status(statusCode).json({ message: message });
  } else {
    // 코드상 잡아내지 못한 에러는 서버에러로 500status를 반환합니다.
    res.status(500).json({ message: "Server Error" });
  }
  next();
};

export { errorLogger, errorResponder };
