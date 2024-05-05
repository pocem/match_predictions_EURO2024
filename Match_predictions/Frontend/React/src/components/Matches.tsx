import React, { useState } from "react";
import metaData from "../../matchdata.json";
import Button from "./Button.tsx";
import "../App.css";

// Define the type for each match
type Match = [string, string, string];

const Matches: React.FC = () => {
  const [currentDay, setCurrentDay] = useState(0);

  // Parse match data from JSON file
  const matches: Match[] = metaData.matchesData.map(
    ([homeTeam, awayTeam, date]) => [homeTeam, awayTeam, date]
  );

  // Filter matches for the current day
  const filteredMatches: Match[] = matches.filter((match: Match) => {
    const matchDay = parseInt(match[2].split(",")[0]); // Extract the day from the match date
    return matchDay === currentDay + 14; // Match the day numbering starting from 1
  });

  return (
    <div className="text-center">
      <table className="mx-auto table table-borderless">
        <thead>
          <tr>
            <th className="day-count">Day {currentDay + 1}</th>
          </tr>
        </thead>
        <tbody className="matches-body">
          {filteredMatches.map((match, index) => (
            <MatchRow key={index} match={match} />
          ))}
        </tbody>
      </table>
      <div>
        <div className="d-flex justify-content-center">
          <Button
            color="success"
            position="absolute"
            bottom="440px"
            left="34%"
            onClick={() => setCurrentDay(currentDay - 1)}
          >
            Last Day
          </Button>
          <span className="mx-2"></span>
          <Button
            color="success"
            position="absolute"
            bottom="440px"
            left="61%"
            onClick={() => setCurrentDay(currentDay + 1)}
          >
            Next Day
          </Button>
        </div>
        <div className="row mt-4">
          <div className="col-8 text-center">
            {" "}
            {/* Center the button using Bootstrap grid */}
            <Button
              color="success button-hover btn-lg"
              position="absolute"
              bottom="200px"
              left="46%"
              onClick={() => setCurrentDay(currentDay)}
            >
              {"Submit Day " + (currentDay + 1)}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface MatchRowProps {
  match: Match;
}

const MatchRow: React.FC<MatchRowProps> = ({ match }) => {
  const [homeTeam, awayTeam, date] = match;

  return (
    <tr>
      <th scope="row" className="align-middle text-center">
        {date}
      </th>
      <td className="align-middle text-center" style={{ width: "150px" }}>
        {homeTeam}
      </td>
      <td className="align-middle text-center" style={{ width: "50px" }}>
        <input
          type="text"
          className="form-control text-center"
          style={{ width: "50px" }}
        />
      </td>
      <td className="align-middle text-center">:</td>
      <td className="align-middle text-center" style={{ width: "50px" }}>
        <input
          type="text"
          className="form-control text-center"
          style={{ width: "50px" }}
        />
      </td>
      <td className="align-middle text-center" style={{ width: "150px" }}>
        {awayTeam}
      </td>
    </tr>
  );
};

export default Matches;
