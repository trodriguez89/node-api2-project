const express = require("express");

const dbRouter = require("../data/db-router");

const server = express();

server.use(express.json());

server.get("/", (request, response) => {
    response.send(`
    <h2>01-14-20 Afternoon Project</h2>
    `)
})

server.use("/api/posts", dbRouter)

module.exports = server;