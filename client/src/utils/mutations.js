import gql from 'graphql-tag';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const SAVE_COMMENT = gql`
  mutation saveComment($commentData: CommentInput!) {
    saveComment(commentData: $commentData) {
      _id
      username
      email
      savedComments {
        commentId
        authors
        image
        description
        title
        link
      }
    }
  }
`;

export const REMOVE_Comment = gql`
  mutation removeComment($commentId: ID!) {
    removeComment(commentId: $commentId) {
      _id
      username
      email
      savedBooks {
        commentId
        authors
        image
        description
        title
        link
      }
    }
  }
`;