import React, { useState } from "react";
import metaData from "../../matchdata.json";
import Button from "./Button.tsx";
import MatchRow from "./MatchRow.tsx";
import "../App.css";

type Match = [string, string, string];
let globalMatchId = 0;

const Matches: React.FC = () => {
  const [currentDay, setCurrentDay] = useState(0);
  const [homeScores, setHomeScores] = useState<number[]>([]);
  const [awayScores, setAwayScores] = useState<number[]>([]);
  const [scoresSubmitted, setScoresSubmitted] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [unsuccessfulMessage, setUnsuccessfulMessage] = useState("");

  const matches: Match[] = metaData.matchesData.map(
    ([homeTeam, awayTeam, date]) => [homeTeam, awayTeam, date]
  );

  const filteredMatches: Match[] = matches.filter((match: Match) => {
    const matchDay = parseInt(match[2].split(",")[0]);
    return matchDay === currentDay + 14;
  });

  const handleHomeScoreChange = (index: number, score: string) => {
    const newHomeScores = [...homeScores];
    newHomeScores[index] = parseInt(score);
    setHomeScores(newHomeScores);
  };

  const handleAwayScoreChange = (index: number, score: string) => {
    const newAwayScores = [...awayScores];
    newAwayScores[index] = parseInt(score);
    setAwayScores(newAwayScores);
  };

  const handleSubmit = async () => {
    const submittedMatchIds: number[] = [];

    const formData = filteredMatches
      .map((_, index) => {
        const match_id = ++globalMatchId;
        if (!submittedMatchIds.includes(match_id)) {
          submittedMatchIds.push(match_id);
          const homeScore = homeScores[index];
          const awayScore = awayScores[index];

          if (
            homeScore === undefined ||
            awayScore === undefined ||
            isNaN(homeScore) ||
            isNaN(awayScore)
          ) {
            setUnsuccessfulMessage(
              "Please provide valid scores for all matches."
            );
            return null;
          }

          return {
            match_id,
            homeScore,
            awayScore,
          };
        } else {
          return null;
        }
      })
      .filter((formData) => formData !== null);

    if (formData.length === 0) {
      setUnsuccessfulMessage("Please provide valid scores for all matches.");
      return;
    }

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
        setUnsuccessfulMessage("Predictions were not saved.");
        throw new Error("Network response was not ok");
      }
      setScoresSubmitted(true);
      setSuccessMessage("Predictions saved.");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleNextDay = () => {
    setCurrentDay(currentDay + 1);
    setHomeScores([]);
    setAwayScores([]);
    setScoresSubmitted(false);
  };

  const handleLastDay = () => {
    setCurrentDay(currentDay - 1);
    setHomeScores([]);
    setAwayScores([]);
    setScoresSubmitted(false);
  };

  const handleAnimationEnd = () => {
    setSuccessMessage("");
    setUnsuccessfulMessage("");
  };

  return (
    <div className="text-center">
      <table className="mx-auto table ">
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
              homeScore={homeScores[index]}
              awayScore={awayScores[index]}
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
            onClick={handleLastDay}
          >
            Last Day
          </Button>
          <span className="mx-2"></span>
          <Button
            color="success"
            position="absolute"
            bottom="440px"
            left="61%"
            onClick={handleNextDay}
          >
            Next Day
          </Button>
        </div>
        <div className="col-4 mx-auto matches-alert">
          {successMessage && (
            <div
              className={`alert alert-success fade-in-out${
                successMessage ? "" : "hidden"
              }`}
              role="alert"
              onAnimationEnd={handleAnimationEnd}
            >
              {successMessage}
            </div>
          )}
          {unsuccessfulMessage && (
            <div
              className={`alert alert-danger ${
                unsuccessfulMessage ? "" : "hidden"
              }`}
              role="alert"
              onAnimationEnd={handleAnimationEnd}
            >
              {unsuccessfulMessage}
            </div>
          )}
        </div>
        {!scoresSubmitted && (
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
        )}
      </div>
    </div>
  );
};

export default Matches;
