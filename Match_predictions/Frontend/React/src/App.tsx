import { useState } from "react";
import ListGroup from "./components/ListGroup.tsx";
import Button from "./components/Button.tsx";
import SignUpForm from "./components/Signup.tsx";
import LoginForm from "./components/Login.tsx";
import Matches from "./components/Matches.tsx";
import Leaderboard from "./components/Leaderboard.tsx";
import "./App.css";
import Ball from "./components/Ball.tsx";

function App() {
  const [showSignUpForm, setShowSignUpForm] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showMatches, setShowMatches] = useState(false);
  const [loggedInUserName, setLoggedInUserName] = useState<string | null>(null);

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
  };

  const handleLeaderboard = () => {
    setShowLeaderboard(true);
    setShowLoginForm(false);
    setShowSignUpForm(false);
    setShowMatches(false);
  };

  const handleMatches = () => {
    setShowMatches(true);
    setShowLeaderboard(false);
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
              <h3 id="welcomeText" className="mt-5">
                Make an account and compete with other players for who is the
                best football analyst!
              </h3>
            </div>
          </div>
          {isLoggedIn && (
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
              <a className="navbar-brand" href="#">
                Navbar
              </a>
              <button
                className="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                  <li className="nav-item active">
                    <a className="nav-link" href="#">
                      Home <span className="sr-only">(current)</span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" onClick={handleMatches}>
                      Predictions
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" onClick={handleLeaderboard}>
                      Leaderboard
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" onClick={handleLogout}>
                      Log out
                    </a>
                  </li>
                </ul>
                <span className="navbar-text ml-auto">
                  {loggedInUserName && `Welcome, ${loggedInUserName}`}
                </span>
              </div>
            </nav>
          )}

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
      </div>
    </div>
  );
}

export default App;
