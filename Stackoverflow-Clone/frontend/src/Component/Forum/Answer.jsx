import React, { useState } from 'react';
import Button from '../AtomComponent/Button';
import axios from 'axios';
import "../../Forum/Style.css"

const Answer = ({ answer, expanded, toggleComments }) => {
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentData, setCommentData] = useState({
    id: '',
    body: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleCreateComment = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to create a comment.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3007/comment/createcomment",
        {
          id: commentData.id,
          body: commentData.body,
          ans_id: answer.answer_id,
        },
        {
          headers: {
            Authorization: ` ${token}`,
          },
        }
      );

      console.log("Comment created successfully:", response.data);
      
     
      setCommentData({
        id: '',
        body: '',
      });
      setShowCommentForm(false);
    } catch (error) {
      console.error("Error creating comment:", error);
      setErrorMessage("Error creating comment: " + error.message);
    }
    window.location.reload();
  };

  return (
    <div key={answer.answer_id} className="main">
      <p className="answer-body"> 
        <strong>Answer:</strong>   {answer.answer_body}
      </p>
      {localStorage.getItem("token") && (
        <Button onClick={() => setShowCommentForm(true)}>Create Comment</Button>
      )}
      {showCommentForm && (
        <div className="create-popup">
          
          <div className="box">
          <h2>Create Comment</h2>
          <label htmlFor="commentId">Comment ID:</label>
          <input
            type="text"
            id="commentId"
            value={commentData.id}
            onChange={(e) =>
              setCommentData({ ...commentData, id: e.target.value })
            }
          />

          <label htmlFor="commentBody">Body:</label>
          <textarea
            id="commentBody"
            value={commentData.body}
            onChange={(e) =>
              setCommentData({ ...commentData, body: e.target.value })
            }
          ></textarea>

          <Button onClick={handleCreateComment}>Submit</Button>
          <Button onClick={() => setShowCommentForm(false)}>Cancel</Button>
        </div></div>
      )}
      {successMessage && <div>{successMessage}</div>}
      {errorMessage && <div>{errorMessage}</div>}
      {expanded && (
        <div className="comment">
          {answer.comments.map(comment => (
            <p key={comment.comment_id} className="comment-body">
              <strong>Comment:</strong> {comment.comment_body}
            </p>
          ))}
        </div>
      )}
      <button className="button" onClick={toggleComments}>
        {expanded ? "Hide comments" : "See all comments"}
      </button>
    </div>
  );
};

export default Answer;


