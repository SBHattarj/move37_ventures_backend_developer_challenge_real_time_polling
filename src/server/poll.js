import express from "express";
// Prisma client imports
import { PublishStatus } from "../generated/prisma/client/index.js";
// database
import { createPoll, deletePoll, getAllPoll, getPollById, updatePoll, getPollsByUser } from "../database/poll.js";
import { createPollOption, deletePollOption, updatePollOption } from "../database/pollOption.js";
// session management
import { Session, verifySession } from "./session.js";
// data verification
import { dataVarify, enumVarifier, intVarifier, optional, stringVarifier } from "../dataVarification/dataVarification.js";

// Schema for different route body, query and params
const CreatePollSchema = {
    question: stringVarifier,
    isPublished: enumVarifier(PublishStatus)
}
const CreatePollOptionSchema = {
    pollId: intVarifier,
    text: stringVarifier
}
const UpdatePollOptionSchema = {
    pollId: intVarifier,
    pollOptionId: intVarifier,
    text: optional(stringVarifier)
}
const DeletePollOptionSchema = {
    pollId: intVarifier,
    pollOptionId: intVarifier
}
const UpdatePollSchema = {
    pollId: intVarifier,
    question: optional(stringVarifier),
    isPublished: optional(enumVarifier(PublishStatus))
}
const getPollsSchema = {
    start: optional(intVarifier),
    limit: optional(intVarifier)
}
const getPollSchema = {
    pollId: intVarifier
}
const deletePollSchema = {
    pollId: intVarifier
}

// Poll router
const poll = express.Router()

// Poll create
poll.post("/create", verifySession, async (req, res) => {
    try {
        // userid from the session
        const userId = req.body[Session].userId
        // verifies the data for required fields and data structure
        const {question, isPublished} = dataVarify(CreatePollSchema, req.body)
        // creates poll
        const poll = await createPoll(question, isPublished, userId)
        res.json(poll)
    } catch (error) {
        // simple error handling
        /**
         * @type {any}
         */
        let e = error
        res.status(400).json({error: e.message})
    }
})

// poll option create
poll.post("/polloption/create", verifySession, async (req, res) => {
    try {
        // userid from the session
        const userId = req.body[Session].userId
        // verifies the data for required fields and data structure
        const {pollId, text} = dataVarify(CreatePollOptionSchema, req.body)
        // gets original poll
        const poll = await getPollById(pollId)
        // makes sure user created the poll
        if(poll.userId !== userId) {
            throw new Error("You are not the owner of this poll")
        }
        // creates poll option
        const pollOption = await createPollOption(text, pollId)
        res.json(pollOption)
    } catch(error) {
        /**
         * @type {any}
         */
        let e = error
        res.status(400).json({error: e.message})
    }
})
poll.post("/polloption/update", verifySession, async (req, res) => {
    try {
        // userid from the session
        const userId = req.body[Session].userId
        // verifies the data for required fields and data structure
        const {pollId, pollOptionId, text} = dataVarify(UpdatePollOptionSchema, req.body)
        // gets original poll
        const poll = await getPollById(pollId)
        // makes sure user created the poll
        if(poll.userId !== userId) {
            throw new Error("You are not the owner of this poll")
        }
        // updates poll option
        const pollOption = await updatePollOption(pollOptionId, pollId, text)
        res.json(pollOption)
    } catch(error) {
        // simple error handling
        /**
         * @type {any}
         */
        let e = error
        res.status(400).json({error: e.message})
    }
})
poll.delete("/polloption/delete", verifySession, async (req, res) => {
    try {
        // userid from the session
        const userId = req.body[Session].userId
        // verifies the data for required fields and data structure
        const {pollId, pollOptionId} = dataVarify(DeletePollOptionSchema, req.body)
        // gets original poll
        const poll = await getPollById(pollId)
        // makes sure user created the poll
        if(poll.userId !== userId) {
            throw new Error("You are not the owner of this poll")
        }
        // deletes poll option
        const pollOption = await deletePollOption(pollOptionId, pollId)
        res.json(pollOption)
    } catch(error) {
        // simple error handling
        /**
         * @type {any}
         */
        let e = error
        res.status(400).json({error: e.message})
    }
})
poll.post("/update", verifySession, async (req, res) => {
    try {
        // userid from the session
        const userId = req.body[Session].userId
        // verifies the data for required fields and data structure
        const {question, isPublished, pollId} = dataVarify(UpdatePollSchema, req.body)
        // gets original poll
        const pollOriginal = await getPollById(pollId)
        // makes sure user created the poll
        if(pollOriginal.userId !== userId) {
            throw new Error("You are not the owner of this poll")
        }
        // updates poll
        const poll = await updatePoll(pollId, userId, question, isPublished)
        res.json(poll)
    } catch(error) {
        // simple error handling
        /**
         * @type {any}
         */
        let e = error
        res.status(400).json({error: e.message})
    }
})

poll.get("/", async (req, res) => {
    try {
        // verifies the data for required fields and data structure
        const {start, limit} = dataVarify(getPollsSchema, req.query)
        // gets all polls within start and start + limit
        const polls = await getAllPoll(start ?? 0, limit ?? 10)
        res.json({polls})
    } catch(error) {
        // simple error handling
        /**
         * @type {any}
         */
        let e = error
        res.status(400).json({error: e.message})
    }
})
poll.get("/self", verifySession, async (req, res) => {
    try {
        // userid from the session
        const userId = req.body[Session].userId
        const {start, limit} = dataVarify(getPollsSchema, req.query)
        // gets all polls created by the user
        const polls = await getPollsByUser(userId, start ?? 0, limit ?? 10)
        res.json({polls})
    } catch(error) {
        // simple error handling
        /**
         * @type {any}
         */
        let e = error
        res.status(400).json({error: e.message})
    }
})
poll.get("/:pollId", async (req, res) => {
    try {
        // verifies the data for required fields and data structure
        const {pollId} = dataVarify(getPollSchema, req.params)
        // gets poll by the id param
        const poll = await getPollById(pollId)
        res.json(poll)
    } catch(error) {
        // simple error handling
        /**
         * @type {any}
         */
        let e = error
        res.status(400).json({error: e.message})
    }
})

poll.delete("/:pollId/delete/", verifySession, async (req, res) => {
    try {
        // userid from the session
        const userId = req.body[Session].userId
        // verifies the data for required fields and data structure
        const {pollId} = dataVarify(deletePollSchema, req.params)
        // gets original poll
        const poll = await getPollById(pollId)
        // makes sure user created the poll
        if(poll.userId !== userId) {
            throw new Error("You are not the owner of this poll")
        }
        // deletes poll
        const pollDeleteResult = await deletePoll(pollId, userId)
        res.json(pollDeleteResult)
    } catch(error) {
        // simple error handling
        /**
         * @type {any}
         */
        let e = error
        res.status(400).json({error: e.message})
    }
})


export default poll
