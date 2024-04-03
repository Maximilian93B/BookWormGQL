const express = require('express');
const { ApolloServer } = require('apollo-server-express'); // Correct import for ApolloServer
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

async function startApolloServer(typeDefs, resolvers) {
  const PORT = process.env.PORT || 3001;
  const app = express();
  
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      const token = req.headers.authorization || '';
      // Verify token and add user to context
    },
  });

  await server.start();

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  // Apply middleware to the Express app
  server.applyMiddleware({ app, path: '/graphql' });

  /*
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
  }
  */

  db.once('open', () => {
    app.listen(PORT, () => 
      console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
    );
  });
}

startApolloServer(typeDefs, resolvers);







