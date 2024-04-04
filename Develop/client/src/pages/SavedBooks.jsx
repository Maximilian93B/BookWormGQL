import React from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

const SavedBooks = () => {
  // Execute the query and rename `data` to `userData` for clarity 
  const { loading, data: userData, error } = useQuery(GET_ME);

  const [removeBook] = useMutation(REMOVE_BOOK, {
    update(cache, { data: { removeBook } }) {
      // Directly update the cache to reflect the removal of a book
      const existingBooks = cache.readQuery({ query: GET_ME });
      cache.writeQuery({
        query: GET_ME,
        data: {
          me: {
            ...existingBooks.me,
            savedBooks: existingBooks.me.savedBooks.filter(book => book.bookId !== removeBook.bookId)
          }
        },
      });
    }
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {error.message}</div>;

  // Ensure you have user data and saved books to work with
  const books = userData?.me?.savedBooks || [];

  const handleDeleteBook = async (bookId) => {
    try {
      await removeBook({
        variables: { bookId },
      });
      removeBookId(bookId); // Assuming this updates local storage accordingly
    } catch (e) {
      console.error('Could not delete book', e);
    }
  };

  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {books.length > 0 ? `Viewing ${books.length} saved book(s):` : 'No saved books found!'}
        </h2>
        <Row>
          {books.map(book => (
            <Col key={book.bookId} md={4}>
              <Card border="dark">
                {book.image && <Card.Img src={book.image} alt={`Cover for ${book.title}`} />}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <Card.Text>
                    Authors: {book.authors.join(', ')}
                  </Card.Text>
                  <Button variant="danger" onClick={() => handleDeleteBook(book.bookId)}>Delete This Book</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
