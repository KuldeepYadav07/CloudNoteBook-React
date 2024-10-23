import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'

const Signup = (props) => {
  const [credential , setCredential]= useState({ name:"" ,  email:"" ,password:""})
  let history=useHistory();

  const handleSubmit= async(e)=>{
    e.preventDefault();
    const response = await fetch("http://localhost:4000/api/auth/createUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({name : credential.name, email:credential.email, password:credential.password }),
      });
      const json = await response.json();
      console.log(json);
      if(json.success){
            localStorage.setItem('token' , json.authtoken);
            props.showAlert("Account created Successfully.! " ,"success")
            history.push("/")
      }else{
        props.showAlert("invalid credentials.! " ,"danger")
      }
}
const onChange=(e)=>{
    setCredential({...credential,[e.target.name]:e.target.value})
}

  return (
    <div className=' container mt-2'>
       <h3 className='my-2'> Create account in CloudNoteBook </h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input type="text" className="form-control" id="name" name='name'  aria-describedby="emailHelp" onChange={onChange}/>
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input type="email" className="form-control" id="email" name='email' aria-describedby="emailHelp" onChange={onChange}/>
          <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
          <input type="password" className="form-control" id="password" name='password' onChange={onChange}  minLength={5} required />
        </div> 
        <button type="submit" className="btn btn-primary">Submit</button>
    </form>
    </div>
  )
}

export default Signup
