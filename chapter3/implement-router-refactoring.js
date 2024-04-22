const http = require('http');
const url = require('url'); // url 모듈 로딩
http
    .createServer((req, res) => {
        const path = url.parse(req.url, false).pathname; // pathname 할당 2번째는 queryString parsing 여부
        res.setHeader("Content-Type", "text/html; charset=utf-8");

        if(path in urlMap){
            try{
                urlMap[path](req, res);
            }
            catch (err){
                console.log(err);
                serverError(req, res);
            }
        }
        else{
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

const serverError = (req, res) => {
    res.statusCode = 500;
    res.end("500 server error");
}

const urlMap = {
    "/": (req, res) => res.end("HOME"),
    "/user": user,
    "/feed": feed,
} // hoisting -> const로 선언한 변수들은 초기화 전에는 읽을 수 없음 따라서 user, feed 아래 선언