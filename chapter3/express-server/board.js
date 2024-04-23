const express = require('express');
const app = express();
let posts = [];

// req.body를 사용하지 않으려면 JSON 미들웨어를 사용해야 함
// 사용하지 않으면 undefined로 반환
app.use(express.json());

// POST 요청 시 Content-Type application/x-www-form-urlencoded 인 경우 parsing
app.use(express.urlencoded({ extended: true })); // JSON 미들웨어와 함께 사용

app.get("/", (req, res) => {
    res.json(posts);
});

app.post("/posts", (req, res) => { // posts 로 post 요청이 오면 실행
    console.log(req.body);
    const { title, name, content } = req.body; // HTTP request 의 body 데이터를 변수에 할당

    // 게시글 리스트에 새로운 게시글 추가
    posts.push({ id: posts.length + 1, title, name, content, createdAt: Date()});
    res.json({ title, name, content });
});

app.delete("/posts/:id", (req, res) => {
    const id = req.params.id;
    const filteredPosts = posts.filter((post) => post.id !== +id); // 글 삭제
    const isLengthChanged = posts.length !== filteredPosts.length; // 삭제 확인
    posts = filteredPosts;

    if(isLengthChanged) {
        res.json("OK");
        return;
    }
    res.json("NOT CHANGED");
});

app.listen(3000, () => console.log("Server started on port 3000"));