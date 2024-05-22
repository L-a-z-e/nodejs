const express = require('express');
const handlebars = require('express-handlebars');
const app = express();

// mongoDB 연결 함수
const mongodbConnection = require("./configs/mongodb-connections")

app.engine("handlebars", handlebars.engine()); // 템플릿 엔진으로 handlebars 등록
app.set("view engine", "handlebars"); // 웹 페이지 로드 시 사용할 템플릿 엔진 설정
app.set("views", __dirname + "/views"); // 뷰 디렉터리를 views로 설정, __dirname 절대경로로 지정 (node를 실행하는 디렉터리 경로)

// 라우터 설정
// home은 template 파일의 이름, views가 기본 경로이고 handlebars가 확장자이므로 views/home.handlebars 파일에 데이터를 렌더링함, title, message가 객체로 들어감
// main template을 사용하지 않으려면 layout: false 속성 추가하면 가능함 res.render("home", { json 부분 , layout: false });
app.get("/", (req, res) => {
    res.render("home", { title: "테스트 게시판" });
});

app.get("/write", (req, res) =>{
    res.render("write", {title: "테스트 게시판"});
});

app.get("/detail/:id", async(req, res) => {
    res.render("detail", { title: "테스트 게시판"});
});

let collection;
app.listen(3000, async () => {
    console.log("Server started");
    // mongodbConnection()의 결과는 mongoClient
    const mongoClient = await mongodbConnection();
    // mongoClient.db() 로 DB선택, collection()으로 Collection 선택
    collection = mongoClient.db('board').collection("post");
    console.log("MongoDB connection successfull");
});

