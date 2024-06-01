const paginator = require("../utils/paginator");

async function list(collection, page, search) {
    const perPage = 10;

    const query = { title: new RegExp(search, "i")};
    const cursor = collection.find(query, { limit: perPage, skip: (page - 1) * perPage}).sort({
        createdDt: -1,
    });

    const totalCount = await collection.count(query);
    const posts = await cursor.toArray();

    const paginatorObj = paginator({ totalCount, page, perPage, });
    return [posts, paginatorObj];

}
async function writePost(collection, post) {
    post.hits = 0;
    post.createdDt = new Date().toString();
    return await collection.insertOne(post);
}

module.exports = {
    list,
    writePost,
};