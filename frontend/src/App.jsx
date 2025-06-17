import React, {useState, useEffect} from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import AccountPage from "./pages/AccountPage.jsx";
import Signup from "./pages/Signup.jsx";
import EditAccount from "./pages/EditAccount.jsx";
import { useAuthContext } from "./hooks/useAuthContext.js";


function App() {
  const [darkMode, setDarkMode] = useState(undefined);
  useEffect(() => {
          const stored = localStorage.getItem("darkMode");
          if (stored !== null) {
              const isDark = stored === "true";
              setDarkMode(isDark);
              document.documentElement.classList.toggle("dark", isDark);
          }
      }, []);
      useEffect(() => {
              if (darkMode !== undefined) {
                  localStorage.setItem("darkMode", darkMode.toString());
                  document.documentElement.classList.toggle("dark", darkMode);
              }
          }, [darkMode]);
  const {user} = useAuthContext()
  return(
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={user ? <Home /> : <Navigate to="/login"/>}/>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/"/>}/>
          <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/"/>}/>
          <Route path="/edit" element={user ? <EditAccount /> : <Navigate to="/login"/>}/>
          <Route path="/user/:id" element={user ? <AccountPage /> : <Navigate to="/login"/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
