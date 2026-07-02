const express = require('express');
const router = express.Router();
const {register, login}= require('../controllers/auth')

/**
 * A User Credentials model for Swagger
 * @typedef {object} AuthModel
 * @property {string} username.required - The unique username
 * @property {string} password.required - The account password
 */

/**
 * POST /api/auth/register
 * @summary Register a new user account
 * @tags auth
 * @param {AuthModel} request.body.required - User login information - application/json
 * @return {object} 201 - Account created response
 */
router.post('/register', register);

/**
 * POST /api/auth/login
 * @summary Log in to get an authentication token
 * @tags auth
 * @param {AuthModel} request.body.required - User login information - application/json
 * @return {object} 200 - Token payload response
 */
router.post('/login', login);

module.exports = router;