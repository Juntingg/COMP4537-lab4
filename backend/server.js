"use strict"

const http = require("http");
const url = require("url");
const msgs = require("./lang/en");

class Server {
    port;
    endpoint;
    server;
    requestCount = 0;

    constructor(port, endpoint) {
        this.port = port;
        this.endpoint = endpoint;
        this.createServer();
    }

    startServer() {
        this.server.listen(this.port)
    }

    closeServer() {
        this.server.close();
    }

    createServer() {
        this.server = http.createServer((req, res) => {
            const q = url.parse(req.url, true);
            const query = q.query;

            res.setHeader("Access-Control-Allow-Origin", "*"); // allows any domain to make requests to server
            res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS"); // defines which HTTP methods allowed
            res.setHeader("Access-Control-Allow-Headers", "Content-Type"); // allows the client to send custom headers
            res.setHeader("Content-Type", "application/json"); // response in JSON format

            // handle options
            if (req.method === "OPTIONS") {
                res.writeHead(204).end();  // no content
                return;
            }

            if (req.method === "GET") {
                this.handleGet(req, res, query);
            } else if (req.method === "POST") {
                this.handlePost(req, res, query);
            } else {
                res.writeHead(405, { "Content-Type": "text/html" });
                res.end(`<p style="color: red;">${msgs.error405}</p>`);
            }
        });
    }

    handleGet() {
        this.requestCount++;
    }

    handlePost() {
        this.requestCount++;
    }
}

module.exports = Server;