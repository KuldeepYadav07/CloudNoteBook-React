import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'

const Login =  (props) => {
    const [credential , setCredential]= useState({email:"" ,password:""})
    let history=useHistory();
    const handleSubmit= async(e)=>{
        e.preventDefault();
        const response = await fetch("http://localhost:4000/api/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email:credential.email, password:credential.password }),
          });
          const json = await response.json();
          console.log(json);
          if(json.success){
              localStorage.setItem('token' , json.authtoken);
                history.push("/")
                props.showAlert("Logged in Successfully " ,"success")
          }else{
            props.showAlert("invalid credentials.! " ,"danger")
          }
    }
    const onChange=(e)=>{
        setCredential({...credential,[e.target.name]:e.target.value})
  }
  return (
    <div className='mt-2'>
            <h3 className='my-2'> Please Provide Login Credential </h3>
            <form onSubmit={handleSubmit} >
            <div className="mb-3">
                <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                <input type="email" className="form-control" id="email" name= "email"  value={credential.email}onChange={onChange} aria-describedby="emailHelp"/>
                <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
            </div>
            <div className="mb-3">
                <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                <input type="password" className="form-control" id="password" value={ credential.password} onChange={onChange}  name='password'/>
            </div>
            <button type="submit" className="btn btn-primary" >Submit</button>
            </form>
    </div>
  )
}

export default Login
