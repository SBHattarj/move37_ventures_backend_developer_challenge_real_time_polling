import {randomBytes, createHmac} from "node:crypto"
import express from "express";
// database imports
import {createUser, getUserByEmail, getAllUsers, getUserById, updateUser, deleteUserById} from "../database/user.js";
import { createSession, deleteSession } from "../database/session.js";
// data varification imports
import {stringVarifier, dataVarify, optional, intVarifier} from "../dataVarification/dataVarification.js";
// local import
import { Session, verifySession } from "./session.js";

// Schema for different route body, query and params
const CreateUserSchema = {
    name: stringVarifier,
    email: stringVarifier,
    password: stringVarifier
}

const LoginSchema = {
    email: stringVarifier,
    password: stringVarifier
}

const GetUsersSchema = {
    start: optional(intVarifier),
    limit: optional(intVarifier)
}

const GetUserSchema = {
    id: intVarifier
}
const UpdateSchema = {
    name: optional(stringVarifier),
    email: optional(stringVarifier),
    password: optional(stringVarifier)
}

/**
 * @param {number} length
 * @returns {string}
 * @description generates a random token for session, only for development must be replaced by a more robust function in production
 */
function tokenGeneretor(length = 32) {
    return Buffer.from(randomBytes(length)).toString("hex")
}

/**
 * @param {string} text 
 * @returns {string}
 * @description hash function for password hashing, only for development must be replaced by a more robust function in production
 */
function hash(text) {
    return createHmac("sha256", process.env.SECRET || '').update(text).digest("hex")
}

// User router
const user = express.Router();

// User create
user.post("/create", async (req, res) => {
    try {
        // verifies the data for required fields and data structure
        const {name, email, password} = dataVarify(CreateUserSchema, req.body)
        // hashes password so that it can be securely stored
        const passwordHash = hash(password)
        // creates user
        const user = await createUser(name, email, passwordHash)
        res.json(user)
    } catch (error) {
        // simple error handling
        /**
         * @type {any}
         */
        let e = error
        res.status(400).json({error: e.message})
    }
})

// User signup
user.post("/signup", async (req, res) => {
    try {
        // verifies the data for required fields and data structure
        const {name, email, password} = dataVarify(CreateUserSchema, req.body)
        // hashes password so that it can be securely stored
        const passwordHash = hash(password)
        // creates user
        const user = await createUser(name, email, passwordHash)
        // creates token for session, then creates session
        const token = tokenGeneretor()
        const session = await createSession(user.id, token)
        // sets session cookie
        res.cookie("token", session.token)
        res.json({token: session.token, user})
    } catch (error) {
        // simple error handling
        /**
         * @type {any}
         */
        let e = error
        res.status(400).json({error: e.message})
    }
})

// User login
user.post("/login", async (req, res) => {
    try {
        // verifies the data for required fields and data structure
        const {email, password} = dataVarify(LoginSchema, req.body)
        // hashes password to check against stored password hash
        const passwordHash = hash(password)
        // gets and varifies user
        const user = await getUserByEmail(email)
        if(!user) {
            throw new Error("user not found")
        }
        if(user.passwordHash !== passwordHash) {
            throw new Error("wrong password")
        }
        // creates token for session, then creates session
        const token = tokenGeneretor()
        const session = await createSession(user.id, token)
        // sets session cookie
        res.cookie("token", session.token)
        res.json({token: session.token, user})
    } catch (error) {
        // simple error handling
        /**
         * @type {any}
         */
        let e = error
        res.status(400).json({error: e.message})
    }
})
// User logout
user.delete("/logout", verifySession, async (req, res) => {
    try {
        // gets token from session, then deletes session from database
        const token = req.cookies.token
        await deleteSession(token)
        // deletes session cookie
        res.cookie("token", "")
        res.send("session deleted")
    } catch(error) {
        // simple error handling
        /**
         * @type {any}
         */
        let e = error
        res.status(400).json({error: e.message})
    }
})

// get all user
user.get("/", async (req, res) => {
    try {
        // verifies the data for required fields and data structure
        const {start, limit} = dataVarify(GetUsersSchema, req.query)
        // gets all users within start and start + limit
        const users = await getAllUsers(start ?? 0, limit ?? 10)
        res.json({users})
    } catch (error) {
        // simple error handling
        /**
         * @type {any}
         */
        let e = error
        res.status(400).json({error: e.message})
    }
})

// get current user
user.get("/self", verifySession, async (req, res) => {
    try {
        // gets userid from session
        const id = req.body[Session].userId
        // gets user by the id param
        const user = await getUserById(id, true)
        res.json({user})
    } catch (error) {
        // simple error handling
        /**
         * @type {any}
         */
        let e = error
        res.status(400).json({error: e.message})
    }
})

// get specific user
user.get("/:id", async (req, res) => {
    try {
        // verifies the data for required fields and data structure
        const {id} = dataVarify(GetUserSchema, req.params)
        // gets user by the id param
        const user = await getUserById(id)
        res.json({user})
    } catch (error) {
        // simple error handling
        /**
         * @type {any}
         */
        let e = error
        res.status(400).json({error: e.message})
    }
})
user.post("/update", verifySession, async (req, res) => {
    try {
        // gets userid from session
        const id = req.body[Session].userId
        // verifies the data for required fields and data structure
        const {name, email, password} = dataVarify(UpdateSchema, req.body)
        // hashes password so that it can be securely stored
        const passwordHash = password != null ? hash(password) : undefined
        // updates user
        const user = await updateUser(id, name, email, passwordHash)
        res.json(user)
    } catch (error) {
        // simple error handling
        /**
         * @type {any}
         */
        let e = error
        res.status(400).json({error: e.message})
    }
})

// delete user
user.delete("/delete", verifySession, async (req, res) => {
    try {
        // gets userid from session
        const id = req.body[Session].userId
        // gets token from cookies
        const token = req.cookies.token
        await deleteSession(token)
        // deletes user
        const user = await deleteUserById(id)
        // deletes session
        res.json(user)
    } catch (error) {
        // simple error handling
        /**
         * @type {any}
         */
        let e = error
        res.status(400).json({error: e.message})
    }
})
export default user
