"use strict";

import { Op } from "sequelize";

export default {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();
    const countArray = [];

    // 1부터 10의 숫자를 countArray에 추가합니다
    for (let i = 1; i < 11; i++) {
      countArray.push(i);
    }

    // DB의 일반유저 데이터들을 뽑아옵니다
    const userRows = await queryInterface.rawSelect(
      "users",
      { where: { role: "user" }, plain: false },
      {}
    );

    // 일반유저의 id들을 가진 Array를 생성합니다
    const userIds = userRows.map((row) => {
      const userId = row.id;

      return userId;
    });

    // DB의 관리자유저 데이터들을 뽑아옵니다
    const adminRows = await queryInterface.rawSelect(
      "users",
      { where: { role: "admin" }, plain: false },
      {}
    );

    // 관리자유저의 id들을 가진 Array를 생성합니다
    const adminIds = adminRows.map((row) => {
      const adminId = row.id;

      return adminId;
    });

    const freePosts = countArray.map((count) => {
      // userIds 중 하나를 랜덤으로 선택합니다
      const rand = Math.floor(Math.random() * userIds.length);
      const userId = userIds[rand];

      const freePost = {
        title: `자유게시판 ${count}`,
        content: `자유게시판 ${count} 내용입니다.
        자유게시판 ${count} 내용입니다.
        자유게시판 ${count} 내용입니다.
        자유게시판 ${count} 내용입니다.`,
        type: "free",
        user_id: userId,
        created_at: now,
        updated_at: now,
      };
      return freePost;
    });

    const noticePosts = countArray.map((count) => {
      // adminIds 중 하나를 랜덤으로 선택합니다
      const rand = Math.floor(Math.random() * adminIds.length);
      const userId = adminIds[rand];

      const noticePost = {
        title: `공지사항 ${count}`,
        content: `공지사항 ${count} 내용입니다.
          공지사항 ${count} 내용입니다.
          공지사항 ${count} 내용입니다.
          공지사항 ${count} 내용입니다.`,
        type: "notice",
        user_id: userId,
        created_at: now,
        updated_at: now,
      };
      return noticePost;
    });

    const operationPosts = countArray.map((count) => {
      // adminIds 중 하나를 랜덤으로 선택합니다
      const rand = Math.floor(Math.random() * adminIds.length);
      const userId = adminIds[rand];

      const operationPost = {
        title: `운영게시판 ${count}`,
        content: `운영게시판 ${count} 내용입니다.
        운영게시판 ${count} 내용입니다.
        운영게시판 ${count} 내용입니다.
        운영게시판 ${count} 내용입니다.`,
        type: "operation",
        user_id: userId,
        created_at: now,
        updated_at: now,
      };
      return operationPost;
    });

    // 3개의 게시판데이터 배열들을 하나로 합쳐서 insertData에 할당합니다
    const insertData = [...freePosts, ...noticePosts, ...operationPosts];

    await queryInterface.bulkInsert("posts", insertData, {});
  },

  down: async (queryInterface, Sequelize) => {
    const countArray = [];

    // 1부터 10의 숫자를 countArray에 추가합니다
    for (let i = 1; i < 11; i++) {
      countArray.push(i);
    }

    const freePostTitles = countArray.map((count) => {
      const title = `자유게시판 ${count}`;
      return title;
    });

    const noticePostTitles = countArray.map((count) => {
      const title = `공지사항 ${count}`;
      return title;
    });

    const operationPostTitles = countArray.map((count) => {
      const title = `운영게시판 ${count}`;
      return title;
    });

    // 3개의 titles Array를 하나로 합쳐서 titles에 할당합니다
    const titles = [
      ...freePostTitles,
      ...noticePostTitles,
      ...operationPostTitles,
    ];

    // titles에 해당하는 데이터를 모두 지웁니다
    await queryInterface.bulkDelete("posts", { title: titles }, {});
  },
};
