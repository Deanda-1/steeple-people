import React, { useState, useEffect } from 'react';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';

import { getMe, deleteComment } from '../utils/API';
import Auth from '../utils/auth';
import { removeCommentId } from '../utils/localStorage';

const SavedComments = () => {
  const [userData, setUserData] = useState({});

  // use this to determine if `useEffect()` hook needs to run again
  const userDataLength = Object.keys(userData).length;

  useEffect(() => {
    const getUserData = async () => {
      try {
        const token = Auth.loggedIn() ? Auth.getToken() : null;

        if (!token) {
          return false;
        }

        const response = await getMe(token);

        if (!response.ok) {
          throw new Error('something went wrong!');
        }

        const user = await response.json();
        setUserData(user);
      } catch (err) {
        console.error(err);
      }
    };

    getUserData();
  }, [userDataLength]);

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteComment = async (commentId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const response = await deleteComment(commentId, token);

      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      const updatedUser = await response.json();
      setUserData(updatedUser);
      // upon success, remove book's id from localStorage
      removeCommentId(commentId);
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (!userDataLength) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Viewing saved comments!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userData.savedComments.length
            ? `Viewing ${userData.savedComments.length} saved ${userData.savedComments.length === 1 ? 'comment' : 'comments'}:`
            : 'You have no saved comments!'}
        </h2>
        <CardColumns>
          {userData.savedComments.map((comment) => {
            return (
              <Card key={comment.commentId} border='dark'>
                {comment.image ? <Card.Img src={comment.image} alt={`The cover for ${comment.title}`} variant='top' /> : null}
                <Card.Body>
                  <Card.Title>{comment.title}</Card.Title>
                  <p className='small'>Authors: {comment.authors}</p>
                  <Card.Text>{comment.description}</Card.Text>
                  <Button className='btn-block btn-danger' onClick={() => handleDeleteComment(comment.commentId)}>
                    Delete this comment!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedBooks;
