const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {

    me: async (_, args, context) => {
      if (!context.user) {
        throw new AuthenticationError('Not logged in');
      }

      return await User.findById(context.user._id)
        .select('-__v -password')
        .populate('savedBooks');
    },
  },
  Mutation: {
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);

      return { token, user };
    },
    addUser: async (_, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);

      return { token, user };
    },
    saveBook: async (_, { bookData }, context) => {
      if (!context.user) {
        throw new AuthenticationError('Not logged in');
      }

      const updatedUser = await User.findByIdAndUpdate(
        context.user._id,
        { $addToSet: { savedBooks: bookData } },
        { new: true, runValidators: true }
      ).populate('savedBooks');

      return updatedUser;
    },
    removeBook: async (_, { bookId }, context) => {
      if (!context.user) {
        throw new AuthenticationError('Not logged in');
      }

      const updatedUser = await User.findByIdAndUpdate(
        context.user._id,
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      ).populate('savedBooks');

      return updatedUser;
    },
  },
};

module.exports = resolvers;
