import React, { useState, useEffect } from 'react';
import { Jumbotron, Container, Col, Form, Button, Card, CardColumns } from 'react-bootstrap';

import Auth from '../utils/auth';
// eslint-disable-next-line
import { saveComment, searchGoogleComments } from '../utils/API';
import { saveCommentIds, getSavedCommentIds } from '../utils/localStorage';

import { useMutation } from '@apollo/react-hooks';
import { SAVE_COMMENT } from '../utils/mutations';

const SearchComments = () => {
// eslint-disable-next-line
  const saveComment = useMutation(SAVE_COMMENT);
  // create state for holding returned google api data
  const [searchedComments, setSearchedComments] = useState([]);
  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState('');

  // create state to hold saved CommentId values
  const [savedCommentIds, setSavedCommentIds] = useState(getSavedCommentIds());

  // set up useEffect hook to save `savedCommentIds` list to localStorage on component unmount
  // learn more here: https://reactjs.org/docs/hooks-effect.html#effects-with-cleanup
  useEffect(() => {
    return () => saveCommentIds(savedCommentIds);
  });

  // create method to search for Comments and set state on form submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }
// Not going to need this function
    try {
      const response = await searchGoogleComments(searchInput);

      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      const { items } = await response.json();

      const commentData = items.map((comment) => ({
        commentId: comment.id,
        authors: comment.volumeInfo.authors || ['No author to display'],
        title: comment.volumeInfo.title,
        description: comment.volumeInfo.description,
        image: comment.volumeInfo.imageLinks?.thumbnail || '',
      }));

      setSearchedComments(commentData);
      setSearchInput('');
    } catch (err) {
      console.error(err);
    }
  };

  // create function to handle saving a Comment to our database
  const handleSaveComment = async (commentId) => {
    // find the book in `searchedComment` state by the matching id
    // Not necessary

    const commentToSave = searchedComments.find((comment) => comment.commentId === commentId);

    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const response = await saveComment(commentToSave, token);
    
      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      // if book successfully saves to user's account, save book id to state
      setSavedBookIds([...savedCommentIds, commentToSave.commentId]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Search for Bible Topics</h1>
          <Form onSubmit={handleFormSubmit}>
            <Form.Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name='searchInput'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type='text'
                  size='lg'
                  placeholder='Search for a bible topic, here.'
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type='submit' variant='success' size='lg'>
                  Submit Search
                </Button>
              </Col>
            </Form.Row>
          </Form>
        </Container>
      </Jumbotron>

      <Container>
        <h2>
          {searchedBooks.length
            ? `Viewing ${searchedComments.length} results:`
            : 'Search for a bible topic to begin'}
        </h2>
        <CardColumns>
          {searchedComments.map((comment) => {
            return (
              <Card key={comment.commentId} border='dark'>
                {comment.image ? (
                  <Card.Img src={comment.image} alt={`The cover for ${comment.title}`} variant='top' />
                ) : null}
                <Card.Body>
                  <Card.Title>{comment.title}</Card.Title>
                  <p className='small'>Authors: {comment.authors}</p>
                  <Card.Text>{comment.description}</Card.Text>
                  {Auth.loggedIn() && (
                    <Button
                      disabled={savedCommentIds?.some((savedCommentId) => savedCommentId === comment.commentId)}
                      className='btn-block btn-info'
                      onClick={() => handleSaveComment(comment.commentId)}>
                      {savedCommentIds?.some((savedCommentId) => savedCommentId === comment.commentId)
                        ? 'This comment has already been saved!'
                        : 'Save this Comment!'}
                    </Button>
                  )}
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SearchBooks;