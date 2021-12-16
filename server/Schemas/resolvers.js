const { User } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');
const { login } = require('../controllers/user-controller');
const resolvers = {};
module.exports = resolvers;