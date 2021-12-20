export const getSavedCommentIds = () => {
  const savedCommentIds = localStorage.getItem('saved_comments')
    ? JSON.parse(localStorage.getItem('saved_comments'))
    : [];

  return savedCommentIds;
};

export const saveCommentIds = (commentIdArr) => {
  if (commentIdArr.length) {
    localStorage.setItem('saved_comments', JSON.stringify(commentIdArr));
  } else {
    localStorage.removeItem('saved_comments');
  }
};

export const removeCommentId = (commentId) => {
  const savedCommentIds = localStorage.getItem('saved_comments')
    ? JSON.parse(localStorage.getItem('saved_comments'))
    : null;

  if (!savedCommentIds) {
    return false;
  }

  const updatedSavedCommentIds = savedCommentIds?.filter((savedCommentId) => savedCommentId !== commentId);
  localStorage.setItem('saved_comments', JSON.stringify(updatedSavedCommentIds));

  return true;
};
