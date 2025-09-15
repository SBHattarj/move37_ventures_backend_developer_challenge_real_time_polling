import db from "../db.js"
import { PublishStatus } from "../generated/prisma/client/index.js"


/**
 * @param {string} question
 * @param {PublishStatus} isPublished
 * @param {number} userId
 * @description creates a poll
 */
export function createPoll(question, isPublished, userId) {
    return db.poll.create({
        data: {
            question,
            isPublished,
            userId
        }
    })
}

// include poll options since it is used in multiple functions
const IncludePollOptions = {
    include: {
        _count: {
            select: {
                votes: true
            }
        }
    }
}

/**
 * @param {number} start
 * @param {number} limit
 * @description returns all polls withing start and start+limit. The polls also include pollOptions, and their vote counts
 */
export function getAllPoll(start, limit, isPublished = PublishStatus.PUBLISHED) {
    return db.poll.findMany({
        skip: start,
        take: limit,
        where: {
            isPublished
        },
        include: {
            PollOptions: IncludePollOptions
        }
    })
}

/**
 * @param {number} userId
 * @param {number} start
 * @param {number} limit
 * @description returns all polls withing start and start+limit. The polls also include pollOptions, and their vote counts
 */
export function getPollsByUser(userId, start, limit) {
    return db.poll.findMany({
        skip: start,
        take: limit,
        where: {
            userId
        },
        include: {
            PollOptions: IncludePollOptions
        }
    })
}

/**
 * @param {number} id
 * @description returns a poll with id, including pollOptions and their vote counts
 */
export function getPollById(id) {
    return db.poll.findUniqueOrThrow({
        where: {
            id
        },
        include: {
            PollOptions: IncludePollOptions
        }
    })
}

/**
 * @param {number} id
 * @param {number} userId
 * @param {string} [question]
 * @param {PublishStatus} [isPublished]
 * @description updates a poll
 */
export function updatePoll(id, userId, question, isPublished) {
    return db.poll.update({
        where: {
            id,
            userId
        },
        data: {
            question,
            isPublished
        }
    })
}
/**
 * @param {number} id
 * @param {number} userId
 * @description deletes a poll
 */
export function deletePoll(id, userId) {
    return db.poll.delete({
        where: {
            id,
            userId
        }
    })
}
