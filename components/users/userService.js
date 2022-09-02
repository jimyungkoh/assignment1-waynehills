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
    const hash = await bcrypt.hash(password, 12)
    console.log("hash : ",hash)
    console.log("typeof hash : ",typeof hash)
    return hash;
}

/**
 * jwt token 을 만드는 메서드 : makeToken
 * @param {number} id 
 * @returns {}
 */
 const makeToken = async (userId) =>{
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
 * 테이블에 username과 password가 같은 항목을 찾는(로그인을 위한) 메서드 : findUser
 * @param {string} username 
 * @param {string} password 
 * @returns 
 */
 const findUser = async (username, password) => {

    const find = await UserModel.findOne({
        where: {
            username: username,
        }
    }).catch((err) => {
        throw new BadRequestError(err)
    });
    if(!find){
        throw new BadRequestError('username Error')
    }
    if(passwordsAreEqual(password,find.password)){
        console.log("find",find)
        return find;
    } else {
        throw new BadRequestError('password Error')
    }

}

/**
 * bcrypt 모듈 내부에서 제공하는 비밀번호 비교 매서드
 * @param {string} enteredPassword 
 * @param {string}  userPassword 
 * @returns {boolean}
 */
 const passwordsAreEqual = async(enteredPassword, userPassword) => {
    const bool = await bcrypt.compare(enteredPassword,userPassword);
    return bool;
}

/**
 * @todo 회원 생성 signUp 메서드 
 * @param {string} name 
 * @param {Date} birthday
 * @param {string} gender 
 * @param {string} phoneNumber
 * @param {string} username 
 * @param {string} password 
 * @returns {} 
 */
 exports.signUp = async (name, username, birthday, gender, phoneNumber,  password) => {
    const aa = await validateUserId(username, phoneNumber)
    if(aa){
        throw new UnauthorizedError('username or phoneNumber already exists');
    }
    const hash = await hashPassword(password)
    const newUser = await UserModel.create({
        name: name,
        username: username,
        password:hash,
        phoneNumber : phoneNumber,
        role:"user",
        //gender:gender,
        birthday:birthday,
        lastLoginDate : new Date(), // 되나??
    }).catch((err) => {
        throw new BadRequestError(err)
    });
    return newUser
}

/**
 * @todo 회원 로그인 login 메서드
 * @param {string} username 
 * @param {string} password
 * @returns {string} // login 성공시 사용자 정보 전달
 */ 

 exports.login = async (username, password) => {
    const correctUser = await findUser(username, password);
    console.log("correctUser : ",correctUser)
    if(correctUser){
        const jwtToken = await makeToken(correctUser.dataValues.id);
        console.log("jwtToken",jwtToken)
        const result ={
            token: jwtToken,
            correctUser:correctUser.dataValues
        }
        
        return correctUser.dataValues
    }
    else {
        throw new BadRequestError('cant find user');
    }
    

}


/**
 * 논리적 삭제 메서드 : deleteUser
 * @todo 회원 삭제 deleteUser 메서드
 * @param {string} username 
 * @returns {???} // 제 생각은 없어도 될듯 합니다만,,
 */
exports.deleteUser = async (username) => {
    await User.update({ deleted_at: new Date() }, 
        { where: { 
            username : username
            } 
        });  
}
/**
 * 삭제 메서드 예시
 * - 삭제 메서드의 호출 주체는 userApi(route)입니다.
 * @param {string} user_id '유저가 설정한' 메서드입니다.
 * exports.delete = async (user_id) => {
 *   const destroyResult = await OpeningModel.destroy({where: {id: id}});
 *
 *   if (!destroyResult) {
 *     throw NotFoundError(`${user_id} doesn't exist in opening table`);
 *   }
 * }
 */


/**
 * @todo 회원 권한변경 editUserRole 메서드
 * @param {string} username 
 * @param {string} role
 * @returns {???} // 제 생각은 없어도 될듯 합니다만,,
 */
exports.editUserRole = async (username, role) => {
    await User.update({ role: role }, 
        { where: { 
            username : username
            } 
        });  
    return res.status(200).json({message:'권한 수정됨'})
}

/**
 * MIDDLEWARE 로 빠질 예정
 * @todo 회원 권한확인 validateUserRole 메서드
 * @param {string} userRole 유저의 권한
 * @param {string} requireRole 요구되는 권한
 * @returns {???} // 사용자 정보
 */
 exports.validateUserRole = async (req,res,next) => {
    const userId = await verify(req.header('token'));
    console.log("token",req.header('token'))
    console.log("userId",userId.id)
    const user = await UserModel.findByPk(userId.id)
    if(!user){
        return res.status(401).json({message: 'User not found'});
    }
    return user.dataValues
} 

/**
 * @todo 회원 중복아이디 확인 validateUserId 메서드
 * @param {string} username 
 * @returns {boolean} 
 */

 const validateUserId = async (username,phoneNumber) => {
    const du =  await UserModel.findOne({
        where: {
            [Op.or]: [
            { username: username},
            { phoneNumber : phoneNumber }
        ],
        }
    }).catch((err) => {
        throw new BadRequestError('bed request');
    });
    console.log("중복된 데이터",du)
    return du

}