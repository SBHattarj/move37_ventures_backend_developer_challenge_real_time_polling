import db from "../db.js"

/**
 * @param {string} text
 * @param {number} pollId
 * @description creates a poll option for a given poll
 */
export function createPollOption(text, pollId) {
    return db.pollOption.create({
        data: {
            text,
            pollId
        }
    })
}

/**
 * @param {number} id
 * @param {number} pollId
 * @param {string} [text]
 * @description updates a poll option
 */
export function updatePollOption(id, pollId, text) {
    return db.pollOption.update({
        where: {
            id,
            pollId
        },
        data: {
            text
        }
    })
}

/**
 * @param {number} id
 * @param {number} pollId
 * @description deletes a poll option
 */
export function deletePollOption(id, pollId) {
    return db.pollOption.delete({
        where: {
            id,
            pollId
        }
    })
}
/**
 * @param {number} pollOptionId
 * @description gets a poll option
 */
export function getPollOption(pollOptionId) {
    return db.pollOption.findUniqueOrThrow({
        where: {
            id: pollOptionId
        }
    })
}
