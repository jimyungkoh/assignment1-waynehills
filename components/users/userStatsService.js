const { UserModel } = require("../../model/index");
const { Op } = require("sequelize");


/**
 * 시간대별 통계((안됨))
 * @param {date} date 
 */
const findUserByTime = async (date)=>{
    let criterion = new Date(date); // 기준점이 되는 날짜
    const byTimes = await UserModel.findAll({
        attributes: ['name', 'username','lastLoginDate'],
        where:{
            lastLoginDate:{
                    [Op.startsWith]:criterion  
            }
        }
    });
    return byTimes;
}   
/**
 * 성별별 통계 
 * @param {string} gender 
 */
const findUserByGender = async (gender)=>{
    const byGender = await UserModel.findAll({
        attributes: ['name', 'username','gender'],
        where:{gender:gender}});
    return byGender;
}

/**
 * 연령대별 통계 ((안됨))
 * @param {number} ages
 */
const findUserByAge = async(ages)=>{
    let birthYearStart = (new Date().getFullYear() - ages -10 ).toString()+'-1-1'
    birthYearStart = new Date(birthYearStart);
    let birthYearEnd = (new Date().getFullYear() - ages ).toString()+'-1-1'
    birthYearEnd = new Date(birthYearEnd);
    //console.log(birthYearStart,"~~~",birthYearEnd)
    //console.log(birthYearStart<new Date("2000-03-07"))
    const byAges = await UserModel.findAll({
        attributes: ['name', 'username','birthday'],
        where:{
            [Op.or]: [{ birthday: {[Op.lte]:birthYearEnd} },
             { birthday: {[Op.gt] : birthYearStart} }
            ]}
    });

    return byAges;
}



module.exports = {
    findUserByAge,
    findUserByTime,
    findUserByGender
}