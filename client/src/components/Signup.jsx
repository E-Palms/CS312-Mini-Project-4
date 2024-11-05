import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import "./styles/Signup.css";

function Signup() {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMatch, setPasswordMatch] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Check if passwords match
        const match = password === confirmPassword && password !== '' && confirmPassword !== '';
        setPasswordMatch(match);
    }, [password, confirmPassword]);

    const handleForm = async (event) => {
        event.preventDefault();

        let userData = {
            userId: userId,
            password: password
        };

        if (passwordMatch) {
            try {
                const response = await fetch("http://localhost:5000/api/signup", {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(userData)
                });
                const data = await response.json();

                if (data.success) {
                    navigate("/");
                } else {
                    setError(data.error);
                }
            } catch (err) {
                console.error("Error during signup:", err);
                setError("An error occurred. Please try again.");
            }
        } else {
            setError("Passwords do not match");
        }
    };

    return (
        <div className="Container">
            <form className="Login" onSubmit={handleForm}>
                <div className="Login-Top">
                    <div className="Login-Title">
                        <h2>Sign Up</h2>
                    </div>
                    <div className="Login-Item-Group">
                        <div>
                            <input
                                className="Login-Item"
                                type="text"
                                placeholder="Username"
                                onChange={(e) => setUserId(e.target.value)}
                                required
                            />
                        </div>
                        <div className="Login-Item-Group-Match">
                            <input
                                className="Login-Item"
                                type="password"
                                placeholder="Password"
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            {passwordMatch && <FontAwesomeIcon style={{marginLeft: "4%"}} icon={faCheck} />}
                        </div>
                        <div className="Login-Item-Group-Match">
                            <input
                                className="Login-Item"
                                type="password"
                                placeholder="Confirm Password"
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            {passwordMatch && <FontAwesomeIcon style={{marginLeft: "4%"}} icon={faCheck} />}
                        </div>
                    </div>
                </div>

                {error && <div className="Error-Message">{error}</div>}

                <div className="Login-Button-Group">
                    <div className="Login-Button">
                        <button type="submit">Sign Up</button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default Signup;
