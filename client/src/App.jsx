import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from './components/Home';
import Login from './components/Login';
import Signup from "./components/Signup";
import Edit from "./components/Edit";
import Account from "./components/Account";
import Header from "./components/Header";


function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleLogin = () => {
       setIsAuthenticated(true);
      };

    const handleLogout = () => {
       setIsAuthenticated(false);
      };

    return (
      <Router>
         <div>
            {isAuthenticated && <Header onLogout={handleLogout} />}
            <Routes>
                <Route path="/" element={isAuthenticated ? <Home /> : <Login onLogin={handleLogin} />} />
                <Route path="/Signup" element={<Signup />} />
                <Route path="/Edit/:postId" element={isAuthenticated ? <Edit /> : <Login onLogin={handleLogin} />} />
                <Route path="/Account" element={isAuthenticated ? <Account /> : <Login onLogin={handleLogin} />} />
            </Routes>
         </div>
      </Router>
    );
}

export default App;
