import React, { useState } from 'react';
import Input from '../AtomComponent/Input'; 
import Button from '../AtomComponent/Button'; 
import axios from 'axios';
import "../../Auth/Style.css"

const Signup = () => {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleIdChange = (e) => {
    setId(e.target.value);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleSignup = async () => {
    try {
      const response = await axios.post(`http://localhost:3007/user/register`, {
        id: id,
        name: name
      });
      console.log('Signup successful:', response.data.token);
      
      setMessage('Signup successful!');

    } catch (error) {
      console.error('Signup failed:', error);
     
      setMessage('Signup failed. Please try again.');
      
    }
  };
  

  return (
    <div className="form-container">
      <div className="box">
      <h2>Signup</h2>
      <Input type="text" placeholder="ID" value={id} onChange={handleIdChange} />
      <Input type="text" placeholder="Name" value={name} onChange={handleNameChange} />
      <Button onClick={handleSignup}>Signup</Button>
      {message && <p>{message}</p>}
    </div></div>
  );
};

export default Signup;
