// This code was assisted by ChatGPT, OpenAI.
const Server = require("./server");
const port = 8000;
const endpoint = "/api/definitions/";

const server = new Server(port, endpoint)
server.startServer();