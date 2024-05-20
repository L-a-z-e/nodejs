const dotenvPath = require('path').resolve(__dirname, '../../chapter6/.env');
console.log(dotenvPath)
require('dotenv').config({ path: '../../chapter6/.env' });
console.log(process.env.MONGO_URI)
const mongodbUri = process.env.MONGO_URI

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Person = require("./person-model.js");

// 몽구스에서 쿼리에 필터를 빈 객체인 {}로 넣으면 모든 값을 불러오게 되어서 문제가 되는 경우
// 이 경우에 에러를 내도록 하는 설정이 strictQuery
mongoose.set("strictQuery", false);

const app = express();
app.use(bodyParser.json()); // HTTP에서 Body를 Parsing 하기위한 설정
app.listen(3000, async () => {
    console.log('Server Started');

    mongoose.connect(mongodbUri)
        .then(console.log("Connected to MongoDB"))
        .catch(err => console.log(err));
});

// 모든 person 데이터 출력
// 특정 데이터를 찾고싶으면 find{name:'Laze'} 로 찾을 수 있음 find(filter, projection, option)
// filter - 검색값
// projection - 가져올 데이터필드
// option - sort(1 asc, -1 desc) { sort: {name:1}}, limit 결과 문서 수, skip - 앞에서 제외할 문서 수
app.get("/person", async(req, res) => {
    const person = await Person.find({});
    res.send(person);
});

// 특정 이메일로 person 찾기
app.get("/person/:email", async (req, res) => {
    const person = await Person.findOne({email: req.params.email});
    res.send(person);
})

// person 데이터 추가하기
// new -> save || const result = await Person.create(req.body); res.send(result); 도 동일함
app.post("/person", async(req, res) => {
    const person = new Person(req.body);
    await person.save();
    res.send(person);
})

// person 데이터 수정하기
app.put("/person/:email", async(req, res) => {
    const person = await Person.findOneAndUpdate(
        {email: req.params.email},
        { $set: req.body },
        { new: true }
    );

    if (person) {
        res.send(person);
    } else {
        res.status(404).send({message: 'Not Found'});
    }
});

// person 데이터 삭제하기
app.delete("/person/:email", async(req, res) => {
    await Person.deleteMany({ email: req.params.email });
    res.send({success: true});
})