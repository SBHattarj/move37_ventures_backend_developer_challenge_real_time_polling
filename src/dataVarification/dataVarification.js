/**
 * @import {Schema} from './dataVarification.types'
 * @import {SchemaToObject} from './dataVarification.types'
 * @import {Varifier} from './dataVarification.types'
 */

/**
 *  @description data varification error
 */
class DataVarificationError extends Error {
    /**
     * @param {string} message
     * @param {string[]} path
     */
    constructor(message, path) {
        super(`${message} at .${path.join('.')}`)
        this.path = path
    }
}

/**
 * @template T
 * @param {Schema<T>} schema
 * @param {unknown} data - the data to be varified
 * @param {string[]} path - path to the data
 * @returns {SchemaToObject<Schema<T>>}
 * @description data varification in according to schema
 */
export function dataVarify(schema, data, path = []) {
    /**
     * @type {any}
     */
    let result = {}
    if(data === undefined || data === null) {
        throw new DataVarificationError("must be an object", path)
    }
    if(typeof data !== 'object') {
        throw new DataVarificationError("must be an object", path)
    }
    /**
     * @type {any}
     */
    const d = data;
    for(let [key, value] of Object.entries(schema)) {
        const currPath = [...path, key]
        if(!(key in d) && !value?.optional) {
            throw new DataVarificationError(`missing ${key}`, path)
        }
        if(typeof value === 'function') {
            result[key] = value(d?.[key], currPath)
            continue
        } 
        if(typeof value !== 'object' || value === null || value == undefined) {
            throw new DataVarificationError(`Incorrect varrifier, expected object or function buf found ${typeof value}`, currPath)
        }
        result[key] = dataVarify(value, d[key], currPath)
        
    }
    return result
}

/**
 * @type {Varifier<number>}
 * @description Varification for integer datatype
 */
export function intVarifier(value, path) {
    if(typeof value === 'number') {
        if(!Number.isInteger(value)) {
            throw new DataVarificationError("must be an integer", path)
        }
        return value
    }
    if(typeof value === 'string') {
        if(value.trim() === '') {
            throw new DataVarificationError("must be an integer", path)
        }
        if(!Number.isInteger(Number(value))) {
            throw new DataVarificationError("must be an integer", path)
        }
        return parseInt(value)
    }
    throw new DataVarificationError("must be an integer", path)
}

/**
 * @type {Varifier<number>}
 * @description Varification for number datatype
 */
export function numberVarifier(value, path) {
    if(typeof value === 'number') {
        if(!Number.isInteger(value)) {
            throw new DataVarificationError("must be a number", path)
        }
        return value
    }
    if(typeof value === "string") {
        if(value.trim() === '') {
            throw new DataVarificationError("must be a number", path)
        }
        if(!Number.isInteger(Number(value))) {
            throw new DataVarificationError("must be a number", path)
        }
        return Number(value)
    }
    throw new DataVarificationError("must be a number", path)
}

/**
 * @type {Varifier<string>}
 * @description Varification for string
 */
export function stringVarifier(value, path) {
    if(typeof value === 'string') {
        return value
    }
    throw new DataVarificationError("must be a string", path)
}

/**
 * @type {Varifier<boolean>}
 * @description Varification for boolean datatype
 */
export function booleanVarifier(value, path) {
    if(typeof value === 'boolean') {
        return value
    }
    if(value === 'true' || value === 'false') {
        return value === 'true'
    }
    throw new DataVarificationError("must be a boolean", path)
}

/**
 * @template P
 * @param {Varifier<P>} varifier 
 * @returns {Varifier<P | undefined>}
 * @description Varification for optional non object data
 */
export function optional(varifier) {
    if(typeof varifier != "function") {
        throw new Error("varifier must be a function")
    }
    /**
     * @type {Varifier<P | undefined>}
     */
    function result(value, path) {
        if(value === undefined) {
            return undefined
        }
        return varifier(value, path)
    }
    result.optional = true
    return result
}

/**
 * @template {{[key: string]: any}} T
 * @param {T} e
 * @returns {Varifier<keyof T>}
 * @description Varification for enum
 */
export function enumVarifier(e) {
    return (value, path) => {
        if(typeof value !== 'string') {
            throw new DataVarificationError("must be an enum", path)
        }
        if(e[value] === undefined) {
            throw new DataVarificationError("must be an enum", path)
        }
        return value
    }
}
