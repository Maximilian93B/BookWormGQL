import { gql } from '@apollo/client';

// User login 
export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

// Add a User 

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
    }
  }
`;

// Save a book 
export const SAVE_BOOK = gql`
mutation saveBook ($bookData: BookInput!) {
    saveBook(bookData: $bookData) {
        _id
        username
        email
        savedBooks{
            bookId
            authors
            title
            description
            image
            link
        }
    }
}
`;

// Remove a book from savedBooks
export const REMOVE_BOOK = gql`
mutation removeBook($bookId: ID!) {
    removeBooks(bookId: $bookId) {
        _id 
        savedBooks{
            bookId
            authors
            title
            description
            image
            link
        }
    }
}
`;