const http = require("http");
const server = http.createServer((req, res) => { // 서버 인스턴스 생성
    res.setHeader("Content-Type", "text/html");
    res.end("OK");
});

server.listen("3000", () => console.log("ok-server is running")); // port , server 실행시 콜백 함수
