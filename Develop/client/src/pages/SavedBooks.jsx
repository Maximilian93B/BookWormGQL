import { useState, useEffect } from 'react';
import {Container,Card,Button,Row,Col} from 'react-bootstrap';
import { getMe, deleteBook } from '../utils/API';
import { removeBookId } from '../utils/localStorage';

// Import mutations + Auth from utils
import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';
import Auth from '../utils/auth';



const savedBooks = () => {
const {loading, data, refetch } = useQuery(GET_ME, {
  // Prevent Apollo from executing query is user is not logged in 
  skip: !Auth.loggedIn(),
});

const [removeBook] = useMutation(REMOVE_BOOK, {
  onCompleted: () => {
    // Refetch the users saved books to update the UI after a book is removed
    refetch();
  }
})

  useEffect(() => {
    if (data) {

      setUserData(data.me || {});
    }
  }, [data]);



  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    try {
      await removeBook({
        variables: {bookId},
      });

      // on success , remove books id from localstorage 
      removeBookId(bookId);
    } catch (error){
      console.error('Error deleting book', error);
    }
  };

  // if data isn't here yet, say so
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  // Possible undefined Data ? 
  /*
  const SavedBooks = data?.me?.savedBooks || [];
  */

  return (
    <>
      <div fluid className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData.savedBooks.map((book) => {
            return (
              <Col md="4">
                <Card key={book.bookId} border='dark'>
                  {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default savedBooks;
