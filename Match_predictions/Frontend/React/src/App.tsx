import { useState } from "react";
import ListGroup from "./components/ListGroup.tsx";
import Button from "./components/Button.tsx";
import SignUpForm from "./components/Signup.tsx";
import LoginForm from "./components/Login.tsx";
import Matches from "./components/Matches.tsx";
import Leaderboard from "./components/Leaderboard.tsx";
import "./App.css";
import Ball from "./components/Ball.tsx";
import Navbar from "./components/Navbar.tsx";
import LoggedUser from "./components/LoggedUser.tsx";
import HomePage from "./components/HomePage.tsx";

function App() {
  const [showSignUpForm, setShowSignUpForm] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showMatches, setShowMatches] = useState(false);
  const [loggedInUserName, setLoggedInUserName] = useState<string | null>(null);
  const [homePage, setHomePage] = useState(true);

  const handleSignUpButtonClick = () => {
    setShowSignUpForm(true);
    setShowLoginForm(false);
  };

  const handleLoginButtonClick = () => {
    setShowLoginForm(true);
    setShowSignUpForm(false);
  };

  const handleLoginSuccess = (name: string) => {
    setIsLoggedIn(true);
    setLoggedInUserName(name); // Set login status to true when login is successful
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoggedInUserName(null);
    setShowLeaderboard(false);
    setShowMatches(false);
    setHomePage(false);
  };

  const handleLeaderboard = () => {
    setShowLeaderboard(true);
    setShowLoginForm(false);
    setShowSignUpForm(false);
    setShowMatches(false);
    setHomePage(false);
  };

  const handleMatches = () => {
    setShowMatches(true);
    setShowLeaderboard(false);
    setHomePage(false);
  };
  const handleHomePage = () => {
    setShowLeaderboard(false);
    setShowLoginForm(false);
    setShowSignUpForm(false);
    setShowMatches(false);
    setHomePage(true);
  };

  return (
    <div className="container-fluid text-center main-body mx-auto">
      <Ball />

      <div className="row">
        <div className="col-2 pl-0">
          <div>{isLoggedIn && <ListGroup />}</div>
        </div>
        <div className="col-8">
          <div className="white-color-text">
            <h1>Match predictor EURO 2024</h1>
            <div>
              {!isLoggedIn && (
                <h3 id="welcomeText" className="mt-5">
                  Make an account and compete with other players for who is the
                  best football analyst!
                </h3>
              )}
            </div>
          </div>
          {isLoggedIn && (
            <Navbar
              loggedInUserName={loggedInUserName}
              handleMatches={handleMatches}
              handleLeaderboard={handleLeaderboard}
              handleLogout={handleLogout}
              handleHomePage={handleHomePage}
            />
          )}
          {isLoggedIn && homePage && <HomePage />}

          {!isLoggedIn && (
            <div className="mt-4">
              {" "}
              {/* Add margin top */}
              <Button color="success" onClick={handleSignUpButtonClick}>
                Signup
              </Button>
              {showSignUpForm && <SignUpForm />}
              <span className="ml-2"></span> {/* Add a small gap */}
              <Button color="success" onClick={handleLoginButtonClick}>
                Login
              </Button>
              {showLoginForm && (
                <LoginForm onLoginSuccess={handleLoginSuccess} />
              )}
            </div>
          )}

          <div>{showLeaderboard && <Leaderboard />}</div>

          <div>{showMatches && <Matches />}</div>
        </div>
        {isLoggedIn && <LoggedUser loggedInUserName={loggedInUserName} />}
      </div>
    </div>
  );
}

export default App;
