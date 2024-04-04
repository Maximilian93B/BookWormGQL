import './App.css';
import Navbar from './components/Navbar';
import { ApolloClient, InMemoryCache, ApolloProvider , createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { Outlet } from 'react-router-dom';

// Construct  main GraphQL API endpoint
const httpLink = createHttpLink({
  uri: 'http://localhost:3001/graphql',
});


// Construct request middleware that will attach the JWT token to every request
const authLink = setContext((_, { headers }) => {
  // Get the authentication token from local storage if it exists
  const token = localStorage.getItem('id_token');
  // Return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});


// Create a new Apollo Client Instance 
const client = new ApolloClient({
  // Set up our client to execute the `authLink` middleware prior to making the request to our GraphQL API
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});


function App() {
  return(
      <>
       <ApolloProvider client={client}>
        <Navbar />
        <Outlet />
        </ApolloProvider>
      </>
  );
}

export default App;
