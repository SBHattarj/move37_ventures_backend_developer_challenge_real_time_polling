/**
 * @import {Request, Response, NextFunction} from "express"
 */

import {getSessionByToken} from "../database/session.js";

export const Session = Symbol("SessionId");

/**
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @description middleware verifies if the user is logged in. If not sends back an error. If is logged in, adds the session to the request before going to the next callback
 */
export async function verifySession(req, res, next) {
    // checks of token exists
    if(!req.cookies.token) {
        res.status(401).json({error: "Unauthorized"})
        return
    }
    try {
        // gets session, throws error if session doesn't exist
        const session = await getSessionByToken(req.cookies.token)
        // if body doesn't already exists in request adds a body
        if(req.body == null || req.body == undefined) {
            req.body = {}
        }
        // adds session to body
        req.body[Session] = session
        next()
    }
    catch(error) {
        // if errors, means the user is not authorized
        res.status(401).json({error: "Unauthorized"})
    }
}
