"use strict"

const http = require("http");
const url = require("url");
const msgs = require("./lang/en");

http.createServer((req, res) => {
    const q = url.parse(req.url, true);
    const query = q.query;


    res.writeHead(404, { "Content-Type": "text/html" });
    res.end(`<p style="color: red;">${msgs.error404}</p>`);
}).listen(3000);