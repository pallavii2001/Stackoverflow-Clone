
import React from 'react';

const Comment = ({ comment }) => {
  return (
    <p key={comment.comment_id} className="comment-body"><strong>Comment:</strong> {comment.comment_body}</p>
  );
};

export default Comment;
