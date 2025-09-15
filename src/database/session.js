import db from "../db.js"

/**
 * @param {number} userId
 * @param {string} token
 * @description creates a session
 */
export function createSession(userId, token) {
    return db.sessions.create({
        data: {
            userId,
            token
        }
    })
}

/**
 * @param {string} token
 * @description gets a session by token
 */

export function getSessionByToken(token) {
    return db.sessions.findUniqueOrThrow({
        where: {
            token
        }
    })
}

/**
 * @param {string} token
 * @description deletes a session by token
 */
export function deleteSession(token) {
    return db.sessions.delete({
        where: {
            token
        }
    })
}
