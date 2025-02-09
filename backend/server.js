"use strict"

const http = require("http");
const url = require("url");
const msgs = require("./lang/en");

class Server {
    port;
    endpoint;
    server;

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
        this.server = http.createServer((req, res) => { // Fix: Assign server instance
            const q = url.parse(req.url, true);
            const query = q.query;

            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
            res.setHeader("Access-Control-Allow-Headers", "Content-Type");
            res.setHeader("Content-Type", "application/json");

            if (req.method === "OPTIONS") {
                res.writeHead(204).end();
                return;
            }

            res.writeHead(404, { "Content-Type": "text/html" });
            res.end(`<p style="color: red;">${msgs.error404}</p>`);
        });
    }



}

module.exports = Server;