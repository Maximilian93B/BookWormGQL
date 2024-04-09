
// Import all modules required
const express = require('express');
const { ApolloServer } = require('apollo-server-express'); // Correct import for ApolloServer
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');
const { authMiddleware } = require('./utils/auth');
const logger = require ('morgan') // Import morgan for HTTP request logging



// Start Apollo Server
async function startApolloServer(typeDefs, resolvers) {
  //Define the PORT , use .env or default to 3001 
  const PORT = process.env.PORT || 3001;
  const app = express();

// Use Morgan for detailed request logging during dev phase 
  app.use(logger('dev'));

  // Apollo Instance , GraphQL --> typeDefs, resolvers from schemas 
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
     // Use the authMiddleware to extract authen data 
    const authData = authMiddleware({ req });
    // Pass tje auth Data to resolvers
    return{...authData };
    },
  });

  // Start the server 
  await server.start();

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  // Apply middleware to the Express app
  server.applyMiddleware({ app, path: '/graphql' });


  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
  }


  db.once('open', () => {
    app.listen(PORT, () => 
      console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
    );
  });
}


startApolloServer(typeDefs, resolvers);







