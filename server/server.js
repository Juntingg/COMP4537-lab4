"use strict"

const http = require("http");
const url = require("url");

http.createServer((req, res) => {
    const q = url.parse(req.url, true);
    const query = q.query;

}).listen(3000);