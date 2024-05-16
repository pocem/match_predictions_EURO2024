import React, { useState } from "react";
import metaData from "../../matchdata.json";
import Button from "./Button.tsx";
import MatchRow from "./MatchRow.tsx";
import "../App.css";

// Define the type for each match
type Match = [string, string, string];
let globalMatchId = 0;
const Matches: React.FC = () => {
  const [currentDay, setCurrentDay] = useState(0);
  const [homeScores, setHomeScores] = useState<number[]>([]); // Changed to number[]
  const [awayScores, setAwayScores] = useState<number[]>([]); // Changed to number[]
  const [scoresSubmitted, setScoresSubmitted] = useState<boolean>(false);
  // Parse match data from JSON file
  const matches: Match[] = metaData.matchesData.map(
    ([homeTeam, awayTeam, date]) => [homeTeam, awayTeam, date]
  );

  // Filter matches for the current day
  const filteredMatches: Match[] = matches.filter((match: Match) => {
    const matchDay = parseInt(match[2].split(",")[0]); // Extract the day from the match date
    return matchDay === currentDay + 14; // Match the day numbering starting from 1
  });

  const handleHomeScoreChange = (index: number, score: string) => {
    const newHomeScores = [...homeScores];
    newHomeScores[index] = parseInt(score); // Convert to number or set to 0 if NaN
    setHomeScores(newHomeScores);
  };

  const handleAwayScoreChange = (index: number, score: string) => {
    const newAwayScores = [...awayScores];
    newAwayScores[index] = parseInt(score); // Convert to number or set to 0 if NaN
    setAwayScores(newAwayScores);
  };

  const handleSubmit = async () => {
    const submittedMatchIds: number[] = []; // Array to store submitted match IDs

    const formData = filteredMatches
      .map((_, index) => {
        const match_id = ++globalMatchId; // Increment globalMatchId for each match
        if (!submittedMatchIds.includes(match_id)) {
          submittedMatchIds.push(match_id);
          return {
            match_id,
            homeScore: homeScores[index] || 0,
            awayScore: awayScores[index] || 0,
          };
        } else {
          return null;
        }
      })
      .filter(
        (
          formData
        ): formData is {
          match_id: number;
          homeScore: number;
          awayScore: number;
        } => formData !== null
      );

    try {
      const response = await fetch("http://127.0.0.1:5000/predictions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      setScoresSubmitted(true);
    } catch (error) {
      console.error("Error:", error);
    }
  };

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
            <MatchRow
              key={index}
              match={match}
              onHomeScoreChange={(score) => handleHomeScoreChange(index, score)}
              onAwayScoreChange={(score) => handleAwayScoreChange(index, score)}
              scoresSubmitted={scoresSubmitted}
            />
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
            onClick={() => {
              setCurrentDay(currentDay - 1);
            }}
          >
            Last Day
          </Button>
          <span className="mx-2"></span>
          <Button
            color="success"
            position="absolute"
            bottom="440px"
            left="61%"
            onClick={() => {
              setCurrentDay(currentDay + 1);
            }}
          >
            Next Day
          </Button>
        </div>
        <div className="row mt-4">
          <div className="col-8 text-center">
            <Button
              color="success button-hover btn-lg"
              position="absolute"
              bottom="200px"
              left="46%"
              onClick={handleSubmit}
            >
              {"Submit Day " + (currentDay + 1)}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Matches;
