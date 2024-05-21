const express = require('express');
const handlebars = require('express-handlebars');
const app = express();

app.engine("handlebars", handlebars.engine()); // 템플릿 엔진으로 handlebars 등록
app.set("view engine", "handlebars"); // 웹 페이지 로드 시 사용할 템플릿 엔진 설정
app.set("views", __dirname + "/views"); // 뷰 디렉터리를 views로 설정, __dirname 절대경로로 지정 (node를 실행하는 디렉터리 경로)

// 라우터 설정
// home은 template 파일의 이름, views가 기본 경로이고 handlebars가 확장자이므로 views/home.handlebars 파일에 데이터를 렌더링함, title, message가 객체로 들어감
// main template을 사용하지 않으려면 layout: false 속성 추가하면 가능함 res.render("home", { json 부분 , layout: false });
app.get("/", (req, res) => {
    res.render("home", { title: "안녕하세요", message: "만나서 반갑습니다!"});
});

app.listen(3000);

