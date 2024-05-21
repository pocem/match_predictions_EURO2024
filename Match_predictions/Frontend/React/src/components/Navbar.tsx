import React from "react";
import "../App.css";

interface NavbarProps {
  loggedInUserName: string | null;
  handleMatches: () => void;
  handleLeaderboard: () => void;
  handleLogout: () => void;
  handleHomePage: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  handleMatches,
  handleLeaderboard,
  handleLogout,
  handleHomePage,
}) => {
  return (
    <nav className="navbar-border navbar navbar-expand-lg navbar-light bg-success mt-4 fly-in-navbar">
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav w-100 d-flex justify-content-between large-text">
          <div className="d-flex">
            <li className="nav-item active">
              <button
                className="btn  btn-success mx-2"
                onClick={handleHomePage}
              >
                Home
              </button>
            </li>
            <li className="nav-item active">
              <button className="btn  btn-success mx-2" onClick={handleMatches}>
                Make your predictions
              </button>
            </li>
            <li className="nav-item active">
              <button
                className="btn btn-success mx-2"
                onClick={handleLeaderboard}
              >
                Leaderboard
              </button>
            </li>
          </div>
          <li className="nav-item active">
            <button className="btn btn-success" onClick={handleLogout}>
              Log out
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
