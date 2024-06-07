const jwt = require('jsonwebtoken')
require('dotenv').config();
const { User, UserClientFields } = require('../models/user')
const secret_key = process.env.JWT_SECRET
/*
 * Authentication middleware
 */
function requireAuthentication(req, res, next) {
    // Get the token from the request
    const auth_header = req.get('Authorization') || '';
    const header_parts = auth_header.split(' ');

    const token = header_parts[0] == "Bearer"? header_parts[1]: null;

    try {
        // verify that it's correct
        const payload = jwt.verify(token, secret_key);
        req.user = payload.sub;
        req.email = payload.email;
        next();

    } catch (err) {
        res.status(401).json({"error": "invalid token"});
    }
}

/*
 * Function to generate JWT for user
 */
function generateAuthToken(userId, email) {
  const payload = {"sub": userId, "email": email};
  return jwt.sign(payload, secret_key, { expiresIn: '24h' });
}

/*
 *
 */
async function checkPermissions(req, res, next) {
    const auth_header = req.get('Authorization') || '';
    const header_parts = auth_header.split(' ');

    const token = header_parts[0] == "Bearer"? header_parts[1]: null;

    try {
        // verify that it's correct
        const payload = jwt.verify(token, secret_key);
        const user = payload.sub;
        const { admin }= await User.findByPk(user, {attributes: ['admin']});
        req.admin = admin;
    } catch (err) {
        req.admin = false;
    }
    next();
}



module.exports = { requireAuthentication, generateAuthToken, checkPermissions}
