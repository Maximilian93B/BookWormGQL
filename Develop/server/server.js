const express = require('express');
// Import Apollo server ,expressMiddleware 
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
// Import the GprahQl schema 
const { typeDefs, resolvers } = require('./schemas/index');
const db = require('./config/connection');


const PORT = process.env.PORT || 3001;
const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

//Create new instance of Apollo server with GraphQL
const StartApolloServer = async () => {
  try{
    await server.start();

    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use('/graphql', expressMiddleware(server));
   
    /*
    if(process.env.NODE_ENV === 'production') {
      app.use(express.static(path.join(__dirname, '../client/build')));
    }
    */

    db.once( 'open', () => {
      app.listen (PORT, () => {
        console.log(`API server running on port ${PORT}!`);
        console.log(`Use GraphQL at http://localhost: ${PORT}/graphql`);
      });
    });
  } catch (error) {
    console.error('Apollo Server startup error:', error);
  }
};


// Call the async function to start server 
StartApolloServer();







