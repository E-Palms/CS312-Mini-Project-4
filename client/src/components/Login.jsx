import React, { useEffect, useState } from "react";
import { response } from "express";
import { useNavigate } from "react-router-dom"

function Login({ onLogin })
   {
    const [userId, setUserId] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    function handleForm(event)
      {
       event.preventDefault()

       let userData = {
         userId:userName,
         password:userPassword
       }

       fetch("http://localhost:5000/api/login", {
         method:'POST',
         headers: {
            "Content-Type":"application/json"
         },
         body:JSON.stringify(userData)})
         .then(response => response.json())
         .then(data => {
            if (data.success)
               {
               onLogin()
               navigate("/")
               }
            else
               {
                setError(data.error)
               }
         })

       console.log("Clicked")
      }

    return (
      <div className="">
        <form onSubmit={handleForm}>
            {error && <div style={{ color: "red"}}>{error}</div>}
            <div className="">
                <div className="p-1">
                    <input className="" type="text" name="userName" placeholder="Username" onChange={(e) => setUserId(e.target.value)} required />
                </div>
                <div className="p-1">
                    <input className="" type="password" name="userPassword" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
                </div>
            </div>
            <div className="">
                <div className="">
                    <button className="" type="submit">Sign In</button>
                </div>
            </div>
            <div>
                <a className="" href="/signup">Sign Up Here</a>
            </div>
        </form>
      </div>
    )
   }

export default Login