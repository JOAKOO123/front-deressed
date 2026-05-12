/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} role
 * @property {boolean} profileCompleted
 */

/**
 * @typedef {Object} AuthResponse
 * @property {string} token
 * @property {User} user
 */

/**
 * @typedef {Object} Product
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {string} image
 * @property {number} price
 */

/**
 * @typedef {Object} Outfit
 * @property {string} id
 * @property {string} name
 * @property {Product[]} products
 */
