import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../hooks/useAuth';



const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const {loading, handleResgister} = useAuth()



  const handleSubmit = async(e) => {
    e.preventDefault();
    const result = await handleResgister({
      username,
      email,
      password,
    });
    
    if (result.success) {
      navigate("/");
    } else {
      alert(result.message);
    }}
    
  if(loading) {
    return (<main> <h1>Loading......</h1></main>);
  }
  
  return ( 
      
      <main>
        <div className="form-container">
          <h1>Register</h1>
          <form onSubmit={handleSubmit} >
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input onChange={(e)=>{setUsername(e.target.value)}} type="text" id="username" name="username" placeholder='Enter your username' required /> 
            </div>

            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input onChange={(e)=>{setEmail(e.target.value)}} type="email" id="email" name="email" placeholder='Enter your email' required /> 
            </div>
  
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input onChange={(e)=>{setPassword(e.target.value)}} type="password" id="password" name="password" placeholder='Enter Password' required />
            </div>
  
            <button className='button primary-button' type="submit">Register</button>
          </form>
          <p>Already have an account? <Link to={"/login"}>Login</Link></p>
        </div>
      </main>
  )
}

export default Register