import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Forum/Style.css";
import Button from "../Component/AtomComponent/Button";
import Question from "../Component/Forum/Question";
import Answer from "../Component/Forum/Answer";
import Comment from "../Component/Forum/Comment";

const IndexPage = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [expandedAnswers, setExpandedAnswers] = useState({});
  const [expandedComments, setExpandedComments] = useState({});
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [showAnswerForm, setShowAnswerForm] = useState(false); 
  const [questionData, setQuestionData] = useState({
    id: "",
    title: "",
    body: "",
  });
  const [answerData, setAnswerData] = useState({
    questionId: "",
    body: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3007/question/viewquestions"
        );
        if (response.data.status === 200) {
          setData(response.data.data.data);
        } else {
          setError(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching data");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const initialExpandedAnswers = {};
    data.forEach((question) => {
      if (question.answers.length > 0) {
        initialExpandedAnswers[question.answers[0].answer_id] = true;
      }
    });
    setExpandedAnswers(initialExpandedAnswers);
  }, [data]);

  const toggleAnswers = (questionId) => {
    setExpandedAnswers((prevState) => ({
      ...prevState,
      [questionId]: !prevState[questionId],
    }));
  };

  const toggleComments = (answerId) => {
    setExpandedComments((prevState) => ({
      ...prevState,
      [answerId]: !prevState[answerId],
    }));
  };

  const handleCreateQuestion = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        "http://localhost:3007/question/createquestion",
        {
          id: questionData.id,
          user_id: localStorage.getItem("userId"),
          title: questionData.title,
          body: questionData.body,
        },
        {
          headers: {
            Authorization: ` ${token}`,
          },
        }
      );

      console.log("Question created successfully:", response.data);
      setSuccessMessage("Question created successfully");
      setQuestionData({
        id: "",
        title: "",
        body: "",
      });
      setShowQuestionForm(false);
    } catch (error) {
      console.error("Error creating question:", error);
      setErrorMessage("Error creating question: " + error.message);
    }
    window.location.reload();
  };

  const handleCreateAnswer = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to create an answer.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3007/answer/createanswer",
        {
          id: answerData.id,
          body: answerData.body,
          ques_id: answerData.questionId,
        },
        {
          headers: {
            Authorization: ` ${token}`,
          },
        }
      );

      console.log("Answer created successfully:", response.data);
      setSuccessMessage("Answer created successfully");
      setAnswerData({
        id: "",
        body: "",
        questionId: "",
      });
      setShowAnswerForm(false); 
    } 
    catch (error) {
      console.error("Error creating answer:", error);
      if (error.response && error.response.status === 404) {
        alert("You are not allowed to answer this question.");
      } else {
        setErrorMessage("Error creating answer: " + error.message);
      }
    }
    window.location.reload();
  };

  return (
    <div className="container">
      <h1>Stackoverflow</h1>

      <div className="mainbody2">
        {localStorage.getItem("token") && (
          <Button onClick={() => setShowQuestionForm(true)}>
            Create Question
          </Button>
        )}
        
      </div>

      {localStorage.getItem("token") && showQuestionForm && (
         <div className="create-popup">
        <div className="box ">
          <h2>Create Question</h2>
          <label htmlFor="id">Question ID:</label>
          <input
            type="text"
            id="id"
            value={questionData.id}
            onChange={(e) =>
              setQuestionData({ ...questionData, id: e.target.value })
            }
          />
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={questionData.title}
            onChange={(e) =>
              setQuestionData({ ...questionData, title: e.target.value })
            }
          />
          <label htmlFor="body">Body:</label>
          <textarea
            id="body"
            value={questionData.body}
            onChange={(e) =>
              setQuestionData({ ...questionData, body: e.target.value })
            }
          ></textarea>

          <Button onClick={handleCreateQuestion}>Submit</Button>
          <Button onClick={() => setShowQuestionForm(false)}>Cancel</Button>
        </div>
        </div>
      )}

      {localStorage.getItem("token") && showAnswerForm && ( 
        <div className="create-popup">
          <div className="box">
            <h2>Create Answer</h2>
            <label htmlFor="answerId">Answer ID:</label>
            <input
              type="text"
              id="answerId"
              value={answerData.id}
              onChange={(e) =>
                setAnswerData({ ...answerData, id: e.target.value })
              }
            />

            <label htmlFor="questionId">Question ID:</label>
            <input
              type="text"
              id="questionId"
              value={answerData.questionId}
              onChange={(e) =>
                setAnswerData({ ...answerData, questionId: e.target.value })
              }
            />
            <label htmlFor="answerBody">Body:</label>
            <textarea
              id="answerBody"
              value={answerData.body}
              onChange={(e) =>
                setAnswerData({ ...answerData, body: e.target.value })
              }
            ></textarea>

            <Button onClick={handleCreateAnswer} >Submit</Button>
          
            <Button onClick={() => setShowAnswerForm(false)}>Cancel</Button>
          </div>
        </div>
      )}

      {successMessage && <div>{successMessage}</div>}
      {errorMessage && <div>{errorMessage}</div>}

      {data.map((question) => (
        <div className="mainbody" key={question.question_id}>
          <Question question={question}/>  
          <div>
          {localStorage.getItem("token") && (
          <Button onClick={() => setShowAnswerForm(true)}>Create Answer</Button> 
          )}</div>
          {question.answers
            .map((answer) => (
              <div key={answer.answer_id}>
                <Answer
                  answer={answer}
                  expanded={expandedComments[answer.answer_id]}
                  toggleComments={() => toggleComments(answer.answer_id)}
                >
                  {expandedComments[answer.answer_id] &&
                    answer.comments.map((comment) => (
                      <Comment key={comment.comment_id} comment={comment} />
                    ))}
                </Answer>
                {localStorage.getItem("token") && (
                  <Button>Create Comment</Button>
                )}
              </div>
            ))
            .slice(0, expandedAnswers[question.question_id] ? undefined : 1)}
          <button
            className="button"
            style={{ marginBottom: "20px" }}
            onClick={() => toggleAnswers(question.question_id)}
          >
            {expandedAnswers[question.question_id]
              ? "Hide answers"
              : "See all answers"}
          </button>
         
        </div>
      ))}
    </div>
  );
};

export default IndexPage;
