import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import './LoginSignup.css'


function Login() {
  const [Password, setPassword] = useState("");

  const [Username, setUsername] = useState("");

  const navigate = useNavigate();
  const handleLogin = async (event) => {
    // Perform login logic
    event.preventDefault();

    try {


      const res = await axios.post(`https://react-golangproject.onrender.com/login`, {
        Username, Password
      })
      if (res.status == 200) {
        console.log(res.data.token);
        localStorage.setItem('token', res.data.token);
        navigate("/");
      }
    } catch (error) {

      alert(error.response.data.error)
      // console.log();

      navigate("/register")
    }


    // window.location.reload();
    // setIsLoggedIn(true);
    // console.log(name, email, password,password);

    // Invoke the callback function after successful login
    // onLoginSuccess();
  };
  return (
    <div className='contain'>
      <form onSubmit={handleLogin} className='form'>
        <h1>Login</h1>
        <div className="mb-3">
          <label for="exampleInputEmail1" className="form-label">Email address</label>
          <input onChange={e => setUsername(e.target.value)} type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
          <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div className="mb-3">
          <label for="exampleInputPassword1" className="form-label">Password</label>
          <input onChange={e => setPassword(e.target.value)} type="password" className="form-control" id="exampleInputPassword1" />
        </div>
        <button type="submit" className="btn btn-outline-secondary">Submit</button>
        <Link to={"/register"} className={"link-styles"}>Click Register</Link>
      </form>
    </div>
  )
}

export default Login
