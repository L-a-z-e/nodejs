const http = require('http');
const url = require('url'); // url 모듈 로딩
http
    .createServer((req, res) => {
        const path = url.parse(req.url, false).pathname; // pathname 할당 2번째는 queryString parsing 여부
        res.setHeader("Content-Type", "text/html; charset=utf-8");

        if(path === "/user") {
            user(req, res);
        }
        else if (path === "/feed") {
            feed(req, res);
        }
        else {
            notFound(req, res);
        }
    })
.listen("3000", () => console.log("router 라우터"));

const user = (req, res) => {
    const userInfo = url.parse(req.url, true).query;
    res.end(`[user] name : ${userInfo.name}, age: ${userInfo.age}`); // user 결과값 설정
}

const feed = (req, res) => {
    res.end(`<ul>
            <li>picture1</li>
            <li>picture2</li>
            <li>picture3</li>
            </ul>
        `);
}

const notFound = (req, res) => {
    res.statusCode = 404;
    res.end("404 page not found");
}