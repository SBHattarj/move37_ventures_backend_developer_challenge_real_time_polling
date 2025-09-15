import db from "../db.js"

/**
 * @param {number} userId
 * @param {number} pollOptionId
 * @description creates a vote for a given poll option
 */
export function createVote(userId, pollOptionId) {
    return db.vote.create({
        data: {
            userId,
            pollOptionId
        }
    })
}

/**
 * @param {number} userId
 * @param {number} pollOptionId
 * @description deletes a vote for a given poll option
 */
export function deleteVote(userId, pollOptionId) {
    return db.vote.delete({
        where: {
            userId_pollOptionId: {
                userId,
                pollOptionId
            }
        }
    })
}
