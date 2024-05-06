const axios = require("axios");
async function getTop20Movies() { // await 사용하므로 async 붙임
    const url = "https://raw.githubusercontent.com/wapj/jsbackend/main/movieinfo.json";
    try {
        const result = await axios.get(url); // 네트워크에서 데이터를 받아오므로 await로 기다림
        const { data } = result; // result 에는 data property 존재

        if (!data.articleList || data.articleList.size == 0) {
            throw new Error("No data");
        }

        const movieInfos = data.articleList.map((article, idx) => {
            return { title: article.title, rank: idx + 1 };
        });

        for (let movieInfo of movieInfos) {
            console.log(`[${movieInfo.rank}위] ${movieInfo.title}`);
        }
    } catch (err) {
        throw new Error(err);
    }

}

getTop20Movies();