const express = require('express');
const handlebars = require('express-handlebars');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// mongoDB 연결 함수
const mongodbConnection = require("./configs/mongodb-connections")
console.log(mongodbConnection);

const postService = require("./services/post-service");
const {ObjectId} = require("mongodb");

let collection;

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
    res.render("write", { title: "테스트 게시판", mode: "create" });
});

app.get("/modify/:id", async(req, res) => {
    const post = await postService.getPostById(collection, req.params.id);
    console.log(post);
    res.render("write", { title: "테스트게시판", mode: "modify", post });
});

app.post("/modify/", async(req, res) => {
    const { id, title, writer, password, content } = req.body;

    const post = {
        title,
        writer,
        password,
        content,
        createdDt: new Date().toISOString(),
    };

    const result = postService.updatePost(collection, id, post);
    res.redirect(`/detil/${id}`)
})

app.post("/write", async(req, res) => {
    const post = req.body;
    const result = await postService.writePost(collection, post);
    // 도큐먼트의 식별자로 사용할 수 있는 insertedId
    res.redirect(`/detail/${result.insertedId}`);
});

app.get("/detail/:id", async(req, res) => {
    const result = await postService.getDetailPost(collection, req.params.id);
    res.render("detail", {
        title: "테스트 게시판",
        post: result.value,
    });
});

app.delete("/delete", async(req, res) => {
    const { id, password } = req.body;
    try {
        // collection의 deleteOne을 사용해 게시글 하나 삭제
        const result = await collection.deleteOne({ _id: ObjectId(id), password: password });

        if (result.deleteCount !== 1) {
            console.log("삭제 실패");
            return res.json({ isSuccess: false });
        }

        return res.json({ isSuccess: true });
    } catch (error) {
        console.error(error);
        return res.json({ isSuccess: false });
    }
});

app.post("/check-password", async(req, res) => {
    const { id, password } = req.body;

    const post = await postService.getPostByIdAndPassword(collection, { id, password });

    if (!post) {
        return res.status(404).json({ isExist: false });
    } else {
        return res.json({ isExist: true });
    }
})

app.get("/", async(req, res) => {
    // 현재 페이지 데이터
    const page = parseInt(req.query.page) || 1;
    const search = req.query.search || "";

    try{
        //postService.list 에서 글 목록, 페이지네이터 가져옴
        const [posts, paginator] = await postService.list(collection, page, search);

        // 리스트 페이지 렌더링
        res.render("home", { title: "테스트 게시판", search, paginator, posts });
    } catch(err) {
        console.error(err);
        res.render("error", { title: "테스트 게시판" });
    }
});

app.post("/write-comment", async(req, res) => {
    const { id, name, password, comment } = req.body;
    const post = await postService.getPostByIdAndPassword(collection, id);

    if (post.comments) {
        post.comments.push({
            idx: post.comments.length + 1,
            name,
            password,
            comment,
            createdDt: new Date().toISOString(),
        });
    } else {
        post.comments = [
            {
                idx: 1,
                name,
                password,
                comment,
                createdDt: new Date().toISOString(),
            },
        ];
    }

    postService.updatePost(collection, id, post);
    return res.redirect(`/detil/${id}`);
});

app.delete("/delete-comment", async(req, res) => {
    const { id, idx, password } = req.body;

    const post = await collection.findOne(
        {
            _id: ObjectId(id),
            comments: { $elemMatch: { idx: parseInt(idx), password }},
        },
        postService.projectionOption,
    );

    if (!post) {
        return res.json({ isSuccess: false });
    }

    post.comments = post.comments.filter((comment) => comment.idx != idx);
    postService.updatePost(collection, id, post);
    return res.json({ isSuccess: true });
});

app.listen(3000, async () => {
    console.log("Server started");
    // mongodbConnection()의 결과는 mongoClient
    const mongoClient = await mongodbConnection();
    // mongoClient.db() 로 DB선택, collection()으로 Collection 선택
    collection = mongoClient.db('board').collection("post");
    console.log("MongoDB connection successfull");
});

app.engine(
    "handlebars",
    handlebars.create({
        helpers: require("./configs/handlebars-helpers"),
    }).engine
)