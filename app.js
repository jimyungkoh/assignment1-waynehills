const express = require('express');
const bodyParser = require('body-parser');

const {PORT} = require('./config/config.js');

/**
 * express middleware를 사용합니다.
 * @todo 교차 출처 리소스 공유 의논해서 다시 작성할 예정
 * @param {express.Application} app express app
 * @returns {express.Application}
 */
function loader(app) {
  app.use(bodyParser.json());
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin',
      '*');
    res.setHeader('Access-Control-Allow-Methods',
      'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers',
      'Content-Type, Authorization');
    next();
  });

  return app;
}

/**
 * API Routers를 등록합니다.
 * @param {express.Application} app express app
 * @returns {*}
 */
function registerRouters(app) {
  // app.use('/components/user/...', routers.xxApi);
  return app;
}

/**
 * express 서비스를 생성합니다.
 */
async function bootstrap() {
  const app = express();

  loader(app);
  registerRouters(app);

  return app.listen(PORT, () => {
    console.log('Running server on ' + PORT);
  });
}

module.exports = {
  bootstrap
}
