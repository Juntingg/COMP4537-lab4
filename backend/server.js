// This code was assisted by ChatGPT, OpenAI.
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

            res.setHeader("Access-Control-Allow-Origin", "*"); // allows any domain to make requests to server
            res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS"); // defines which HTTP methods allowed
            res.setHeader("Access-Control-Allow-Headers", "Content-Type"); // allows the client to send custom headers
            res.setHeader("Content-Type", "application/json"); // response in JSON format

            // handle options
            if (req.method === "OPTIONS") {
                res.writeHead(204).end();  // no content
                return;
            }

            if (!q.pathname.startsWith(this.endpoint)) {
                res.end(JSON.stringify({ message: msgs.error404 })); // page not found
                return;
            }

            if (req.method === "GET") {
                this.handleGet(req, res, q);
            } else if (req.method === "POST") {
                this.handlePost(req, res, q);
            } else {
                res.writeHead(405, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: msgs.error405 })); // method not supported
            }
        });
    }

    handleGet(req, res, q) {
        this.reqCount++;
        const word = q.query.word;

        if (this.dictionary.has(word)) {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: msgs.wordFound(word, this.dictionary.get(word), this.reqCount) })); // gets word, defiinition, and reqCount

        } else {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: msgs.wordNotFound(word, this.reqCount) }));
        }
    }

    async handlePost(req, res, q) {
        this.reqCount++;

        try {
            const data = await this.parseBody(req); // await parsed body

            if (!this.isValidWord(data.word)) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: msgs.error400 }));
                return;
            }

            if (this.dictionary.has(data.word)) {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: msgs.wordExists(data.word, this.reqCount) }));
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
            let body = ""; // empty string to store req data
            req.on("data", chunk => { // listen for data events
                body += chunk; // append chunk to body
            });
            req.on("end", () => { // end when all chunks received
                try {
                    res(JSON.parse(body)); // resolves with parsed JSON
                } catch (err) {
                    rej(new Error(msgs.errorJSON)); // rejects if JSON is invalid
                }
            });
        });
    }

    isValidWord(word) {
        return /^[A-Za-z\s]+$/.test(word.trim());
    }
}

module.exports = Server;