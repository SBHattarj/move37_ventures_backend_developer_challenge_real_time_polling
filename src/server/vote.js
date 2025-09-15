import express from "express"
// database imports
import { createVote, deleteVote } from "../database/vote.js"
import { getPollOption } from "../database/pollOption.js"
// data varification imports
import {intVarifier, dataVarify} from "../dataVarification/dataVarification.js"
// notification imports
import { notifyVote, VoteAction } from "../server.js"
// local import
import {Session, verifySession} from "./session.js"

const vote = express.Router()

const CreateVoteSchema = {
    pollOptionId: intVarifier
}

// add vote
vote.post("/create", verifySession, async (req, res) => {
    try {
        // userid from the session
        const userId = req.body[Session].userId
        // verifies the data for required fields and data structure
        const {pollOptionId} = dataVarify(CreateVoteSchema, req.body)
        // creates vote
        const vote = await createVote(userId, pollOptionId)
        // get pollOption to get pollId and notify
        const pollOption = await getPollOption(pollOptionId)
        notifyVote(pollOption.pollId, pollOptionId, VoteAction.INCREMENT)
        res.json(vote)
    } catch(error) {
        // simple error handling
        /**
         * @type {any}
         */
        let e = error
        res.status(400).json({error: e.message})
    }
})

// remove vote
vote.delete("/delete", verifySession, async (req, res) => {
    try {
        // userid from the session
        const userId = req.body[Session].userId
        // verifies the data for required fields and data structure
        const {pollOptionId} = dataVarify(CreateVoteSchema, req.body)
        // deletes vote
        const vote = await deleteVote(userId, pollOptionId)
        // get pollOption to get pollId and notify
        const pollOption = await getPollOption(pollOptionId)
        notifyVote(pollOption.pollId, pollOptionId, VoteAction.DECREMENT)
        res.json(vote)
    } catch(error) {
        // simple error handling
        /**
         * @type {any}
         */
        let e = error
        res.status(400).json({error: e.message})
    }
})
export default vote
