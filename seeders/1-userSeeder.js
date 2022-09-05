"use strict";

const bcrypt = require("bcrypt");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();
    const saltRounds = 16;
    const salt = await bcrypt.genSalt(saltRounds);

    // 어드민 계정 생성
    await queryInterface.bulkInsert(
      "users",
      [
        {
          name: "관리자1",
          username: "admin1",
          password: await bcrypt.hash("admin123!", salt),
          phone_number: "010-1234-1234",
          role: "admin",
          gender: "male",
          birthday: "1999-01-17",
          last_login_date: "2022-01-17T04:33:12.000",
          created_at: now,
          updated_at: now,
        },
        {
          name: "관리자2",
          username: "admin2",
          password: await bcrypt.hash("admin123@", salt),
          phone_number: "010-1234-5678",
          role: "admin",
          gender: "female",
          birthday: "2000-03-17",
          last_login_date: "2021-06-11T04:33:12.000",
          created_at: now,
          updated_at: now,
        },
      ],
      {}
    );

    // 일반유저 계정 생성
    await queryInterface.bulkInsert(
      "users",
      [
        {
          name: "유저1",
          username: "user1",
          password: await bcrypt.hash("user123!", salt),
          phone_number: "010-1111-2222",
          role: "user",
          gender: "male",
          birthday: "1988-07-19",
          last_login_date: "2022-07-20T04:33:12.000",
          created_at: now,
          updated_at: now,
        },
        {
          name: "유저2",
          username: "user2",
          password: await bcrypt.hash("user123@", salt),
          phone_number: "010-3333-4444",
          role: "user",
          gender: "female",
          birthday: "1994-03-11",
          last_login_date: "2022-04-30T04:33:12.000",
          created_at: now,
          updated_at: now,
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    const userNames = ["user1", "user2", "admin1", "admin2"];

    await queryInterface.bulkDelete("users", { username: userNames }, {});
  },
};
