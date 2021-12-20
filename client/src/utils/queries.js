import gql from 'graphql-tag';

export const QUERY_ME = gql`
  {
    me {
      _id
      username
      email
      savedComments {
        CommentId
        tag
        image
        description
        title
        link
      }
    }
  }
`;