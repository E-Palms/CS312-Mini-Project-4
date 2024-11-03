import Home from './components/Home';
import Login from './components/Login';
import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from "react";

function App() {

   const [isAuthenticated, setIsAuthenticated] = useState(false);

   function handleLogin()
      {
       setIsAuthenticated(true);
      }

   function handleLogout()
      {
       setIsAuthenticated(false);
      }


  return (
    <div className="App">
      {isAuthenticated ? <Home onLogout={handleLogout} /> : <Login onLogin={handleLogin} />}
    </div>
  );
}

export default App;
