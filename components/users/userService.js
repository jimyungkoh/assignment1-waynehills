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