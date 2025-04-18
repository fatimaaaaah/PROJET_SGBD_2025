import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./components/connexion/signUp";
import Login from "./components/connexion/login";
import Acceuil from "./components/connexion/acceuil";
import Home from "./components/professeur/home";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Sujets from "./components/professeur/sujets";
import Corrections from "./components/professeur/corrections";
import Notification from "./components/professeur/notifications";
import Settings from "./components/professeur/parametre";
import Profil from "./components/professeur/profil";
import UserManual from "./components/professeur/manuel";
import Dashboard from "./components/professeur/dashboard";
import { GitHubProvider } from './context/GitHubContext';

const App = () => {
  return (
    <GoogleOAuthProvider clientId="608829330179-fjkmteld0kvu5fi3dmks192cia6mlt9i.apps.googleusercontent.com">
      <GitHubProvider clientId="Ov23liXiPg89uvMwvlMY">
        <ThemeProvider>
          <AuthProvider>
            <Router>
              <Routes>
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Acceuil />} />
                <Route path="/acceuil" element={<Acceuil />} />
                <Route path="/home" element={<Home />} />
                <Route path="/sujets" element={<Sujets />} />
                <Route path="/corrections" element={<Corrections />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/notifications" element={<Notification />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/profil" element={<Profil />} />
                <Route path="/manuel" element={<UserManual />} />
              </Routes>
            </Router>
          </AuthProvider>
        </ThemeProvider>
      </GitHubProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
