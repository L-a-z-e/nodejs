const express = require('express'); // express 모듈 불러오기
const app = express(); // express를 초기화 후 app에 할당

const port = 3000;
app.get('/', (req, res) => {
    res.set({ "Content-Type": "text/html; charset=utf-8" });
    res.end("Hello Express");
});

app.listen(port, () => {    // 서버를 기동, 클라이언트 요청을 기다림
    console.log(`START SERVER: use ${port}`);
});