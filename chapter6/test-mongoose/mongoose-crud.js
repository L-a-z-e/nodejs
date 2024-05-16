const dotenvPath = require('path').resolve(__dirname, '../.env');
console.log(`Trying to load .env from: ${dotenvPath}`);
require('dotenv').config({ path: dotenvPath });
// require('dotenv').config({ path: '../.env' });


// require('dotenv').config({path: './chapter6/.env'});
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Person = require("./person-model.js");

mongoose.set("strictQuery", false);

const app = express();
app.use(bodyParser.json());
app.listen(3000, async () => {
    console.log('Server Started');
    const mongodbUri = process.env.MONGODB_URI;
    console.log(mongodbUri);
    mongoose.connect(mongodbUri)
        .then(console.log("Connected to MongoDB"))
        .catch(err => console.log(err));
});

// 모든 person 데이터 출력
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
});

// person 데이터 삭제하기
app.delete("/person/:email", async(req, res) => {
    await Person.deleteMany({ email: req.params.email });
    res.send({success: true});
})