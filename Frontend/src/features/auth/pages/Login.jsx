import React, { useState } from 'react'
import '../../auth/authform.scss'
import { useNavigate , Link} from 'react-router'
import { useAuth } from '../hooks/useAuth'



const Login = () => {

  const {loading, handleLogin} = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await handleLogin({
      email,
      password,
  });
  
  if (result.success) {
      navigate("/");
  } else {
      alert(result.message);
  }
};

  if(loading) {
    return (<main> <h1>Loading......</h1></main>);
  }


  return (
    <main>
      <div className="form-container">
        <h1>Login</h1>
        <form onSubmit={handleSubmit} >
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input onChange={(e)=>{setEmail(e.target.value)}} type="email" id="email" name="email" placeholder='Enter Email Adress' required /> 
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input onChange={(e)=>{setPassword(e.target.value)}} type="password" id="password" name="password" placeholder='Enter Password' required />
          </div>

          <button className='button primary-button' type="submit">Login</button>
        </form>
        <p>Don't have an account? <Link to={"/register"}>Register </Link></p>

      </div>
    </main>
  )
}

export default Login