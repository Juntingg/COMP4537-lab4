"use strict"

const http = require("http");
const url = require("url");
const msgs = require("./lang/en");

class Server {
    port;
    endpoint;
    server;
    reqCount = 0;
    dictionary = new Map();

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

    handleGet(req, res, query) {
        this.reqCount++;

        if (!query.pathname.startsWith(this.endpoint)) {
            res.writeHead(404).end();
            return;
        }

    }

    async handlePost(req, res, query) {
        this.reqCount++;

        if (!query.pathname.startsWith(this.endpoint)) {
            res.writeHead(404).end();
            return;
        }

        try {
            const data = await this.parseBody(req); // await parsed body

            if (!this.isValidWord(data.word)) {
                res.writeHead(400, { "Content-Type": "text/plain" });
                res.end(`<p style="color: red;">${msgs.error400}</p>`);
                return;
            }

            if (this.dictionary.has(data.word)) {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: msgs.wordExists(data.word) }));
                return;
            }

            this.dictionary.set(data.word, data.definition); // adds word

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({
                message: msgs.wordAdded(data.word, data.definition, this.reqCount, this.dictionary.size)
            }));

        } catch (err) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: err.message }));
        }
    }

    parseBody(req) {
        return new Promise((res, rej) => {
            let body = "";
            req.on("data", chunk => {
                body += chunk;
            });
            req.on("end", () => {
                try {
                    res(JSON.parse(body)); // resolves with parsed JSON
                } catch (err) {
                    rej({ error: err.message }); // rejects if JSON is invalid
                }
            });
        });
    }

    isValidWord(word) {
        return word.trim() !== "" && !/\d/.test(word);
    }
}

module.exports = Server;