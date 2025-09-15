import db from "../db.js";

/**
 * @param {string} name 
 * @param {string} email
 * @param {string} passwordHash
 * @description creates a user
 */
export function createUser(name, email, passwordHash) {
    return db.user.create({
        data: {
            name,
            email,
            passwordHash
        }
    })
}

/**
 * @param {number} id
 * @param {string} [name]
 * @param {string} [email]
 * @param {string} [passwordHash]
 * @description updates a user
 */
export function updateUser(id, name, email, passwordHash) {
    return db.user.update({
        where: {
            id
        },
        data: {
            name,
            email,
            passwordHash
        }
    })
}

/**
 * @param {number} start
 * @param {number} limit
 * @description returns all users within start and start+limit
 */
export function getAllUsers(start, limit) {
    return db.user.findMany({
        skip: start,
        take: limit,
        select: {
            id: true,
            name: true,
            email: true
        }
    })
}

/**
 * @param {number} id
 * @param {boolean} [isUser]
 * @description returns a user with id
 */
export function getUserById(id, isUser = false) {
    return db.user.findUniqueOrThrow({
        where: {
            id
        },
        select: {
            id: true,
            name: true,
            email: true,
            passwordHash: isUser
        }
    })
}

/**
 * @param {string}  email
 * @description returns a user with email
 */
export function getUserByEmail(email) {
    return db.user.findUniqueOrThrow({
        where: {
            email
        }
    })
}

/**
 * @param {number} id
 * @param {{name?: string, email?: string, passwordHash?: string}} data
 * @description deletes a user
 */

/**
 * @param {number} id
 */

export function deleteUserById(id) {
    return db.user.delete({
        where: {
            id
        }
    })
}
