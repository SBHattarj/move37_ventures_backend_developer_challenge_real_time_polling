// for loading the .env files
import dotenv from "dotenv"
dotenv.config()

// Main Server
import {addRoute} from "./src/server.js"
// Routes
import user from "./src/server/user.js"
import poll from "./src/server/poll.js"
import vote from "./src/server/vote.js"

addRoute("/api/user", user)
addRoute("/api/poll", poll)
addRoute("/api/vote", vote)

// exporting serverListen for testing purposes
export { serverListen } from "./src/server.js"
