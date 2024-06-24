
import React from 'react';
import axios from 'axios';

const Question = ({ question }) => {
  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    
  
    const confirmDelete = window.confirm("Are you sure you want to delete this question?");
    if (!confirmDelete) {
      return; 
    }
  
    const config = {
      headers: {
        Authorization: ` ${token}`,
      },
      data: {
        id: question.question_id,
      },
    };
  
    try {
      const response = await axios.delete("http://localhost:3007/question/deleteQuestion", config);
      console.log(response.data); 
      alert("Question deleted successfully");
    } catch (error) {
      console.error("Error deleting question:", error);
      
    }
    window.location.reload();
  };
  

  return (
    <div key={question.question_id} className="main" >
      <h2 className="question-title">
        Id: {question.question_id}   Title: {question.question_title}
      </h2> 
      <p className="question-body">Question: {question.question_body}</p>
      {localStorage.getItem("token") &&(
      <button onClick={handleDelete}>Delete</button>)}
    </div>
  );
};

export default Question;



