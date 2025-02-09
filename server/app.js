"use strict"

const http = require("http");
const url = require("url");
const msgs = require("./lang/en");

http.createServer((req, res) => {
    const q = url.parse(req.url, true);
    const query = q.query;

    res.setHeader("Access-Control-Allow-Origin", "*"); // allows any domain to make requests to server
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS"); // defines which HTTP methods allowed
    res.setHeader("Access-Control-Allow-Headers", "Content-Type"); // allows the client to send custom headers
    res.setHeader("Content-Type", "application/json"); // response in JSON format

    // handle options
    if (req.method === "OPTIONS") {
        res.writeHead(204).end(); // no content
        return;
    }

    res.writeHead(404, { "Content-Type": "text/html" });
    res.end(`<p style="color: red;">${msgs.error404}</p>`);
}).listen(3000);