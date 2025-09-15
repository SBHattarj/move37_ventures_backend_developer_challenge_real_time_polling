import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";

// express app innitialization
const app = express();

// middlewares
app.use(express.json());
app.use(cookieParser())

// test route
app.get("/", (req, res) => {
    res.send("<script src='https://cdn.socket.io/4.8.1/socket.io.min.js'></script><script>const socket=io()</script>")
})



/**
 * @enum {string}
 * @description vote action enum. Added for flexibility and rigidity
 */
export const VoteAction = {
    INCREMENT: "increment",
    DECREMENT: "decrement"
}


/**
 * @param {string} path
 * @param {import("express").Router} router
 * @description to add new routes to the server, this was added so that the routes may not be imported here, thus allowing the socket io to be imported in the routes.
 */
export function addRoute(path, router) {
    app.use(path, router)
}

/**
 * starts listening for events to http
 */
export const serverListen = app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running at http://localhost:${process.env.PORT || 3000}`)
})
// socket.io connection
export const io = new Server(serverListen);
/**
 * @param {number} pollId
 * @param {number} pollOptionId
 * @param {VoteAction} action
 * @description emits event when a vote is added to a poll option or removed
 */
export function notifyVote(pollId, pollOptionId, action) {
    // only observed by those who are viewing the current poll
    io.emit(`vote:${pollId}`, {
        action,
        pollOptionId
    })
}
