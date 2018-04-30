const path = require('path');
const Utils = require(path.resolve('./utils/utils'));

const endpoints = [
    {
        method: 'GET',
        path: '/profile',
        config: {
            auth: 'jwt'
        },
        handler: async function (req, h) {
            return Utils.sanitizeUser(req.user);
        }
    }
];

module.exports = endpoints;