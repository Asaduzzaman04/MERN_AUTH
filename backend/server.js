//dependencies
import http from "http";
import app from "./app.js";
import { database } from "./db/db.js";


//add port number
const port = process.env.port || 9000;

//create a server
const server = http.createServer(app);

server.listen(port,  async() => {
    await database()
  console.log(`server listen on http://localhost:${port}`);
});

export default server;
