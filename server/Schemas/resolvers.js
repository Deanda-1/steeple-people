// import user model
const { User } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');
const { login } = require('../controllers/user-controller');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const userInfo = await User.findOne({ _id: context.user._id }).select('-__v -password');return userInfo;}
            throw new AuthenticationError('You need to be logged in!');
        },
    },
    Mutation: {
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('Incorrect Username or Password');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect Username or Password');
            }
            
            const token = signToken(user);
            return { token, user };

        },
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);
            
            return { token, user };
        },
        saveBook: async (parent, { bookData }, context) => {
            if (context.user) {
                const userUpdate = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $push: { savedBooks: bookData } },
                    { new: true }
                );

                return userUpdate;
            }
            throw new AuthenticationError('You are not logged in. Log in.');

        },
        removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
              const updatedUser = await User.findByIdAndUpdate(
                { _id: context.user._id },
                { $pull: { savedBooks: { bookId } } },
                { new: true }
              );
      
              return updatedUser;
              }

              throw new AuthenticationError('You are not logged in. Log in!!');
            },
    },
};

module.exports = resolvers;