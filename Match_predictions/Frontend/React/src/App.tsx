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

  const handleSignUpButtonClick = () => {
    setShowSignUpForm(true);
    setShowLoginForm(false);
  };

  const handleLoginButtonClick = () => {
    setShowLoginForm(true);
    setShowSignUpForm(false);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true); // Set login status to true when login is successful
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

      <div className="row ">
        <div className="col-2  pl-0">
          <div>{isLoggedIn && <ListGroup />}</div>
        </div>
        <div className="col-8 ">
          <div className="white-color-text">
            <h1>Match predictor EURO 2024</h1>
            <div>
              <h2 id="welcomeText" className="mt-5">
                Make an account and compete with other players for who is the
                best football analyst!
              </h2>
            </div>
          </div>

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
              <LoginForm onLoginSuccess={() => handleLoginSuccess()} />
            )}
          </div>

          <div>
            {!showLeaderboard ? (
              <Button
                color="success button-hover"
                onClick={handleLeaderboard}
                position="absolute"
                bottom="550px"
                left="76%"
              >
                Go to Leaderboard
              </Button>
            ) : (
              <Leaderboard />
            )}
          </div>
          <div>
            {!showMatches ? (
              <Button color="success button-hover mt-4" onClick={handleMatches}>
                Show me the matches!
              </Button>
            ) : (
              <Matches />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
