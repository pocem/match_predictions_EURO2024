import React from "react";
import "../App.css";

interface LoggedUserProps {
  loggedInUserName: string | null;
}

const LoggedUser: React.FC<LoggedUserProps> = ({ loggedInUserName }) => {
  return (
    <div className="logged-user col-2">
      {loggedInUserName && `Logged as: ${loggedInUserName}`}
    </div>
  );
};

export default LoggedUser;
