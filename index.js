const {bootstrap} = require('./app');

bootstrap()
  .catch((e) => {
    console.error('Internal Server Error!!', e);
  })
