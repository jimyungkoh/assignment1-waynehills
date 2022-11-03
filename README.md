# 회원 정보 & 게시판 관리 RESTful API 서버

- ~[회원 정보 & 게시판 관리 RESTful API 서버](https://team-g-board-api-fmx4v.ondigitalocean.app/api-docs/)가 오픈되었습니다!~ (평가기간 종료로 운영 중단)

**22.09.01 ~ 22.09.05**   

## 🌱 서비스 개요
회원 정보 내용을 포함하는 테이블을 설계하고 다음과 같은 기능을 제공하는 RESTful API 서버 개발을 목적으로 구현하였습니다.

- 공지사항, 자유게시판, 운영 게시판
- 회원 등급에 따른 게시판 기능 접근제어
- 회원가입, 로그인, 회원 탈퇴
- 이용 통계집계

### ERD

![image](https://user-images.githubusercontent.com/50348197/188470317-17512323-9cc4-4c7f-a4a0-899035d5f29c.png)

### 기술 스택
`nodejs` `express.js` `sequelize` `mySql` `swagger`

### 폴더 구조
```.
├── README.md
├── components
│   ├── posts
│   │   ├── postApi.js
│   │   ├── postService.js
│   │   └── postModel.js
│   └── users
├── .idea
├── config
├── errors
├── middlewares
├── models
├── seeders
├── swagger
│
├── .gitignore
├── .eslintrc.json
├── .prettierrc.json
├── app.js
├── index.js
├── package-lock.json
└── package.json
```
#### Directory
* components : 
    * posts : posts 도메인의 요청에 대한 소스코드들이 모여있습니다.
      * postApi.js : request에대한 라우터 설정과 postService 호출, response를 담당합니다.
      * postService.js : 서비스로직 적용과 ORM을 통한 DB통신을 담당합니다.
      * postModel.js : post 테이블이 작성되어있습니다.
    * users : users 도메인의 요청에 대한 소스코드들이 모여있습니다.

* .idea : 
* config : 프로젝트에 필요한 환경변수들이 모여있습니다.
* errors : 프로젝트에 사용될 httpError클래스들이 있습니다.
* middlewares : 컨트롤러에 닿기 전에 반복되는 로직을 모듈화 해 놓은 폴더입니다.(Error로거 & 핸들러, 토큰검사기)
* models : Sequelize connection에 필요한 로직이 들어있습니다.
* seeders : 정적데이터를 생성하는 seeder파일들이 모여있습니다.
* swagger : 

#### File
* .eslintrc.json : 협업시 동일한 eslint 설정을위해 적용될 json 형태의 파일입니다.
* .prettierrc.json : 협업시 동일한 prettier 설정을위해 적용될 json 형태의 파일입니다.
* app.js : 서버를 필요한 각종 소스코드와 미들웨어들을 조합합니다.
* index.js : 


### 협업 방식( git flow )
  
`master` `stage` `feature` 세 종류의 브랜치를 기본으로 사용합니다.  
1. 이슈를 선정하고 이슈번호에 맞는 `feature/issueNumber` 브랜치를 만들어 기능을 개발합니다.  
2. 구현이 끝나면 `stage` 에 PR합니다. 이때, 머지를 위해선 2인 이상의 리뷰가 필요합니다.  
3. 각 기능이 병합된 `stage` 에서 `master`로 병합합니다.  

![image](https://user-images.githubusercontent.com/30682847/188534420-a6f06cd1-513e-480a-9742-5860f71282f2.png)

## 💡 요구사항 구현 내용

### 회원 정보 관리

**회원가입**  
  1. 사용자는 이름, id(username), 성별, 생년월일, 전화번호, 비밀번호를 입력해 회원가입을 시도합니다.
  2. 이때 id(username) 또는 전화번호가 기존 DB에 존재한다면 회원가입이 되지 않습니다. `BadRequestError`
  3. 사용자가 입력한 비밀번호는 `bcrypt`를 이용해 암호화된 상태로 DB에 저장됩니다.
  4. 사용자가 회원가입한 시간(`created_at`)이 저장되며, 논리삭제를 위한 `deleted_at`은 null로 초기화됩니다.
    
![image](https://user-images.githubusercontent.com/50348197/188390937-868a531e-19c0-47f9-b2a2-a3a715a48b32.png)
![image](https://user-images.githubusercontent.com/50348197/188390999-fd5821fa-6105-4726-b563-3ed4ac373966.png)
  
**로그인**    
  1. 회원가입시에 입력한 id(username), 비밀번호를 통해 로그인을 시도합니다.
  2. 암호화된 상태의 패스워드를 복호화하지 않고 비교합니다.
  3. 사용자가 입력한 id(username)이 DB에 없거나, 비밀번호가 다르다면 `BadRequestError`를 반환합니다.
  4. 로그인이 완료된 사용자는 일정 시간만 사용 가능한 JWT token 값을 배정받게 됩니다.
    
![image](https://user-images.githubusercontent.com/50348197/188390601-462ab506-05ee-41cf-89cd-e474edcbb7a9.png)
  
**회원탈퇴**  
  1. 회원가입시 입력한 id(username)을 통해 DB에서 사용자 정보를 조회합니다.
  2. ORM 상에서 destroy 하면 `deleted_at` 칼럼에 현재 시간 정보가 저장됩니다.
  3. `deleted_at`이 null이 아니라면 DB상에서 조회가 되지 않습니다. 논리적으로 탈퇴가 구현됩니다.
    
![image](https://user-images.githubusercontent.com/50348197/188395081-500fae2c-baca-4e43-9dfe-c159bc1a0d44.png)
  
**회원 권한 변경**  
  1. 회원가입시 입력한 id(username)과 변경될 role 정보를 입력합니다.
  2. 사용자의 역할이 기존 user에서 입력한 role로 변경됩니다.
    
![image](https://user-images.githubusercontent.com/50348197/188395162-38e812b6-2bfd-439f-8c05-ff65c8e5072d.png)
  
### 게시판 정보 관리

게시판은 총 세 가지(운영, 공지, 자유 게시판)로 구분됩니다.

- 유저는 자유 게시판에서 글을 작성, 조회, 수정, 삭제를 진행할 수 있습니다.
- 유저는 공지 게시판을 조회할 수는 있지만, 공지 게시판에 글을 작성, 수정, 삭제를 할 수는 없습니다.
- 운영자는 운영, 공지, 자유 게시판의 글을 작성, 조회, 수정, 삭제할 수 있습니다.

권한 처리를 제외하면, 나머지 로직이 같기 때문에 자유 게시판 기준으로 설명합니다.

**게시판 내 여러 건의 게시물 조회**
 1. userAuthChecker를 이용해 게시판 이용 권한이 있는 사용자를 판별합니다.
 2. 로그인한 유저가 게시판 이용 권한이 있는 사용자라면, {user, postType, skip, limit}을 서비스 로직에 보내 페이징 처리된 검색 결과를 가져옵니다.
 3. 검색된 결과를 json 형식으로 반환합니다.

![image](https://user-images.githubusercontent.com/30682847/188548665-1f447266-b2e2-433d-808a-67a814d692c9.png)

**게시판 내 게시글 작성**
 1. userAuthChecker를 이용해 게시판 이용 권한이 있는 사용자를 판별합니다.
 2. 로그인한 유저가 게시판 이용 권한이 있는 사용자라면, {post, user}를 서비스 로직에 보내 작성 결과를 가져옵니다.
 3. 작성이 성공했다면 201 메시지를 보내며 게시글이 등록됩니다.

![image](https://user-images.githubusercontent.com/30682847/188546635-4bc3ffce-bffb-492e-bf39-b40364af15e7.png)

**게시판 내 단건 게시물 조회**
 1. userAuthChecker를 이용해 게시판 이용 권한이 있는 사용자를 판별합니다.
 2. 로그인한 유저가 게시판 이용 권한이 있는 사용자라면, {postId, user}를 서비스 로직에 보내 해당하는 페이지 객체를 가져옵니다.
 3. 검색된 결과를 json 형식으로 반환합니다.

![image](https://user-images.githubusercontent.com/30682847/188546130-a178c1a9-00d5-4cb4-a4ee-6403f80753e9.png)

**게시판 내 게시글 수정**
 1. userAuthChecker를 이용해 게시판 이용 권한이 있는 사용자를 판별합니다.
 2. 로그인한 유저가 게시판 이용 권한이 있는 사용자라면, {postId, newPost, user}를 서비스 로직에 보내 작성자 id와 수정 요청 id를 비교합니다.
 3. 작성자 id와 삭제 요청자 id가 같다면, 200(OK) 메시지를 보내며 게시글이 수정됩니다.

![image](https://user-images.githubusercontent.com/30682847/188547890-330c4f8e-e874-4160-a6c4-c89ddb367a3b.png)

**게시판 내 게시글 삭제**
 1. userAuthChecker를 이용해 게시판 이용 권한이 있는 사용자를 판별합니다.
 2. 로그인한 유저가 게시판 이용 권한이 있는 사용자라면, {postId, user}를 서비스 로직에 보내 작성자 id와 삭제 요청 id를 비교합니다.
 3. 작성자 id와 삭제 요청자 id가 같다면, 200(OK) 메시지를 보내며 게시글이 삭제됩니다.
![image](https://user-images.githubusercontent.com/30682847/188547101-a7ab6545-3e94-43f7-a0dd-ce304fcad10d.png)

## 🛠 실행 방법 정리
```
npm install
```
  
``` 
npm start 
npm run dev // 개발자용
npm run swagger // swagger용
```

## 🧐 G팀 개발의 특징
### G팀을 소개합니다! 

🤴 [고지명](https://github.com/jimyungkoh)   
😎 [정진관](https://github.com/dingwan0331)   
🍀 [남승인](https://github.com/RunningLearner)  
🔪 [이권석](https://github.com/LEEGWONSEOK)  
👶 [서유진](https://github.com/yujiniii)  


### 커밋 컨벤션
`fix:` 버그가 발생해 코드를 고칠 때   
`feat:` 기능을 추가할 때  
`build:` 빌드할 때  
`chore:` 설정 변경 발생시(단순오타 등은 refactor 😊)   
`docs:` 문서 수정(마크다운 파일, swagger doc 등)   
`style:` 코드 스타일 수정(개행 등)   
`refactor:` 코드의 기능변화 없이 수정할 때  
`test:`  테스트파일 관련 작업(jest)   
  
 ### JSDoc 사용
 **예시)**
 ```js
 /**
 * @description 유저의 게시글 수정, 삭제 권한을 확인합니다.
 * @param {string} userRole 유저의 권한
 * @param {number} expectedUserId 현재 접속한 유저의 id
 * @param {number} actualUserId 게시글을 작성한 유저의 id
 * @throws {ForbiddenError} 유저는 해당 게시글 수정, 삭제 권한이 없음
 * @returns {boolean} 게시글 수정, 삭제 권한을 확인 결과
 */
 ```
