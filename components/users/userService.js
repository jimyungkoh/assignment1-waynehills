const {UserModel} = require('./userModel');
const {BadRequestError, UnauthorizedError} = require('../../errors/httpErrors');
const {secretKey,option} = require('../../config/jwt.config')
const bcrypt = require ('bcrypt')

/**
 * 입력된 패스워드는 암호화해 저장 : hashPassword 
 * @param {string} password 
 * @returns {string} 
 */
hashPassword = async (password) => {
    const hash = await bcrypt.hash(password, salt)
    return hash;
}
/**
 * jwt token 을 만드는 메서드 : jwt
 * @param {int} id 
 * @returns {}
 */
const jwt = async (userId) =>{
    const payload = {
        id : userId
    }
    const result = {
        token : jwt.sign(payload, secretKey, option)
    }
    return result;
}
/**
 * 토큰을 통해 다시 사용자id를 불러오는 메서드 : verify
 * @param {string} token 
 * @returns {int} 
 */
const verify = async (token) => {
    let decoded;
    try {
      decoded = await jwt.verify(token, secretKey, option);
    } catch (err) {
        if (err.message === 'jwt expired') {
            console.log('expired token');
            return 'TOKEN_EXPIRED';
        } else {
            console.log('invalid token');
            return 'TOKEN_INVALID';
        }
    }

    return decoded;
}

/**
 * 테이블에 username과 password가 같은 항목을 찾는 메서드 : findUser
 * @param {string} username 
 * @param {string} password 
 * @returns 
 */
const findUser = async (username, password) => {
    return await User.findOne({
        where: {
            username: username,
            password: hashPassword(password)}
    }).catch((err) => {
        return next(err);
    });
}



/**
 * @todo 회원 생성 signUp 메서드 
 * @param {string} name 
 * @param {??} birthday //이건 저도 어떤타입인지..
 * @param {string} gender 
 * @param {string} phoneNumber
 * @param {string} username 
 * @param {string} password 
 * @returns {json} 
 */
exports.signUp = async (name, username, birthday, gender, phoneNumber,  password) => {
    if(validateUserId){
        return UnauthorizedError('같은 아이디가 존재합니다.');
    }
    const newUser = await User.create({
        name: name,
        username: username,
        password:hashPassword(password),
        phone_number : phoneNumber,
        // role:,
        gender:gender,
        birthday:birthday,
        last_login_date : new Date(), // 되나??
    }).catch((err) => {
        return BadRequestError(err)
    });
    return res.status(200).json({newUser})
}

/**
 * @todo 회원 로그인 login 메서드
 * @param {string} username 
 * @param {string} password
 * @returns {???} // 제 생각은 없어도 될듯 합니다만,,
 */ 
// login 성공시 req에 username과 role을 추가해주세요.
// ex))
// req.username = username;
// req.role = 'admin'
exports.login = async (username, password) => {
    const correctUser = await findUser(username, password);

    if(correctUser){
        const jwtToken = await jwt.sign(correctUser.dataValues.id);

        return res.status(200).json({
            user: authenticatedUser,
            token: jwtToken,
            correctUser:correctUser.dataValues
        });
    }

    return UnauthorizedError('아이디와 비밀번호를 확인해 주세요');

}


/**
 * 이거는 api 에서 안 꺼내쓰고 서비스 내부에서 해결 가느ㅡㅇ할듯???
 * @todo 회원 중복아이디 확인 validateUserId 메서드
 * @param {string} username 
 * @returns {boolean} 
 */

exports.validateUserId = async (username) => {
    return await User.findOne({
        where: {
            username: username
        }
    }).catch((err) => {
        return next(err);
    });
}