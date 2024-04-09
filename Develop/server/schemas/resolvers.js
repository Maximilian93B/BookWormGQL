const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

// Resolvers to handle GraphQL queries + Mutations 
const resolvers = {
  // Query resolvers for fetching data 
  Query: {
    me: async (_, args, context) => {
      // If user is not logged in throw error 
      if (!context.user) {
        throw new AuthenticationError('Not logged in');
      }
      // Fetch user from the db using _id excluding fields and populating 'savedBooks'
      return await User.findById(context.user._id)
      .select('-__v -password')
      .populate('savedBooks');
    },
  },
  // Mutation resolvers to handle creating , updating and deleting books from 'savedBooks
  Mutation: {
    // resolver for login mutation 
    login: async (_, { email, password }) => {
      // attempt to find the user 
      const user = await User.findOne({ email });
      // Throw error if user or password does not exist or incorrect 
      if (!user || !(await user.isCorrectPassword(password))) {
        throw new AuthenticationError('Incorrect credentials');
      }
      
      
      // If auth is success, allocate token to user
      const token = signToken(user);
      // Return the token and the user details 
      return { token, user };
    },
    // Add a user 
    addUser: async (_, { username, email, password }) => {
      // Create a user with the User properties
      const user = await User.create({ username, email, password });
      const token = signToken(user);

      return { token, user };
    },

    // Save a book
    // If not logged in throw error 
    saveBook: async (_, { bookData }, context) => {
      if (!context.user) {
        throw new AuthenticationError('Not logged in');
      }
      // Update the 'savedBooks' 
      // Add new Book data 
      // return updated 'saveBooks' with new details 
      const updatedUser = await User.findByIdAndUpdate(
        context.user._id,
        // Use $addToSet to ensure no duplicates
        { $addToSet: { savedBooks: bookData } },
        // Return the updated document and run validators
        { new: true, runValidators: true }
      ).populate('savedBooks');

      return updatedUser;
    },
    // Remove a book from 'savedBooks'
    // Throw auth error if not logged in
    // same as update except use $pull to remove from savedBooks with bookId 
    removeBook: async (_, { bookId }, context) => {
      if (!context.user) {
        throw new AuthenticationError('Not logged in');
      }
      // Update User with removed book
      const updatedUser = await User.findByIdAndUpdate(
        context.user._id,
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      ).populate('savedBooks');

      return updatedUser;
    },
  },
};

// Export the resolvers
module.exports = resolvers;
