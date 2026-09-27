require('dotenv').config();
const http = require('http');
const app = require('./app');
const { attachSockets } = require('./sockets');

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
attachSockets(server);

server.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`환경: ${process.env.NODE_ENV || 'development'}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM 신호 수신. 서버 종료 중...');
  server.close(() => {
    console.log('서버가 종료되었습니다.');
    process.exit(0);
  });
});

module.exports = server;
