import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./styles/Login.css"

function Login({ onLogin }) {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleForm = async (event) => {
        event.preventDefault();

        let userData = {
            userId: userId,
            password: password
        };

        try {
            const response = await fetch("http://localhost:5000/api/login", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userData)
            });
            const data = await response.json();

            if (data.success) {
                onLogin();
                navigate("/");
            } else {
                setError(data.error);
            }
        } catch (err) {
            console.error("Error during login:", err);
            setError("An error occurred. Please try again.");
        }
    };

    return (
        <div className="Container">
            <form className="Login" onSubmit={handleForm}>
               <div className="Login-Top">
                  <div className="Login-Title">
                     <h2>Login</h2>
                  </div>

                  <div className="Login-Item-Group">
                     <input className="Login-Item"
                        type="text"
                        placeholder="Username"
                        onChange={(e) => setUserId(e.target.value)}
                        required />
                     <input className="Login-Item"
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                        required />
                  </div>
               </div>
                
               {error && <div className="Error-Message" >{error}</div>}
                
               <div className="Login-Button-Group">
                  <div className="Login-Button">
                     <button type="submit">Sign In</button>
                  </div>
                  
                  <div className="Signup-Group">
                     <p>Not Registered?</p>
                     <Link className="Signup-Link" to={"/Signup"}>Sign Up</Link>
                  </div>
               </div>
                
            </form>
        </div>
    );
}

export default Login;
