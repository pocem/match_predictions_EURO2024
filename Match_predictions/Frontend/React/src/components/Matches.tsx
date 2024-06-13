import React, { useState, useEffect } from "react";
import metaData from "../../matchdata.json";
import Button from "./Button";
import MatchRow from "./MatchRow";
import "../App.css";

// Define Match type as an object with match_id
type Match = {
  match_id: number;
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
};

const Matches: React.FC = () => {
  const [currentDay, setCurrentDay] = useState(0);
  const [allScores, setAllScores] = useState<{ [day: number]: DayScores }>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [unsuccessfulMessage, setUnsuccessfulMessage] = useState("");

  interface DayScores {
    homeScores: { [matchId: number]: number };
    awayScores: { [matchId: number]: number };
    submitted: boolean;
  }

  // Transform matches data to the correct Match type with match_id
  const matches: Match[] = metaData.matchesData.map(
    ([homeTeam, awayTeam, date, time], index) => ({
      match_id: index + 1, // Assign a unique ID
      homeTeam,
      awayTeam,
      date,
      time,
    })
  );

  // Filter matches based on the current day
  const filteredMatches: Match[] = matches.filter((match: Match) => {
    const matchDay = parseInt(match.date.split(",")[0]);
    return matchDay === currentDay + 14;
  });

  useEffect(() => {
    const fetchSavedPredictions = async () => {
      try {
        const response = await fetch(
          "https://matchpredict-f88c889f1126.herokuapp.com/predictions",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (!response.ok) {
          setUnsuccessfulMessage("Failed to fetch saved predictions.");
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        console.log("fetched saved predictions:", data);

        const newAllScores: { [day: number]: DayScores } = {};

        data.forEach(
          (prediction: {
            match_id: number;
            home_score: number;
            away_score: number;
          }) => {
            const { match_id, home_score, away_score } = prediction;

            const matchIndex = matches.findIndex(
              (match) => match.match_id === match_id
            );

            if (matchIndex !== -1) {
              const matchDay = parseInt(matches[matchIndex].date.split(",")[0]);
              const dayIndex = matchDay - 14;

              newAllScores[dayIndex] = newAllScores[dayIndex] || {
                homeScores: {},
                awayScores: {},
                submitted: false,
              };

              newAllScores[dayIndex].homeScores[match_id] = home_score;
              newAllScores[dayIndex].awayScores[match_id] = away_score;
            }
          }
        );

        setAllScores(newAllScores);
        console.log("all scores data:", newAllScores);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchSavedPredictions();
  }, []);

  const handleHomeScoreChange = (matchId: number, score: string) => {
    const newScores = { ...allScores };
    newScores[currentDay] = newScores[currentDay] || {
      homeScores: {},
      awayScores: {},
      submitted: false,
    };
    newScores[currentDay].homeScores[matchId] = parseInt(score);
    setAllScores(newScores);
    console.log("handle homescorechange data newScores:", newScores);
  };

  const handleAwayScoreChange = (matchId: number, score: string) => {
    const newScores = { ...allScores };
    newScores[currentDay] = newScores[currentDay] || {
      homeScores: {},
      awayScores: {},
      submitted: false,
    };
    newScores[currentDay].awayScores[matchId] = parseInt(score);
    setAllScores(newScores);
    console.log("handle homescorechange data newScores:", newScores);
  };

  const handleSubmit = async () => {
    const currentScores = allScores[currentDay] || {
      homeScores: {},
      awayScores: {},
      submitted: false,
    };
    const submittedMatchIds: number[] = [];

    // Validate that all scores are provided and are valid numbers
    let validScores = true;
    filteredMatches.forEach((match) => {
      const matchId = match.match_id;
      const homeScore = currentScores.homeScores[matchId];
      const awayScore = currentScores.awayScores[matchId];

      if (
        homeScore === undefined ||
        awayScore === undefined ||
        isNaN(homeScore) ||
        isNaN(awayScore)
      ) {
        validScores = false;
      }
    });

    if (!validScores) {
      setUnsuccessfulMessage("Please provide valid scores for all matches.");
      return;
    }

    const formData = filteredMatches
      .map((match) => {
        const matchId = match.match_id;

        if (!submittedMatchIds.includes(matchId)) {
          submittedMatchIds.push(matchId);
          const homeScore = currentScores.homeScores[matchId];
          const awayScore = currentScores.awayScores[matchId];

          return {
            match_id: matchId,
            homeScore,
            awayScore,
          };
        } else {
          return null;
        }
      })
      .filter((formData) => formData !== null);

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
      const newScores = { ...allScores };
      newScores[currentDay] = { ...currentScores, submitted: true };
      setAllScores(newScores);
      setSuccessMessage("Predictions saved.");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleNextDay = () => {
    setCurrentDay(currentDay + 1);
  };

  const handleLastDay = () => {
    setCurrentDay(currentDay - 1);
  };

  const handleAnimationEnd = () => {
    setSuccessMessage("");
    setUnsuccessfulMessage("");
  };

  const currentScores = allScores[currentDay] || {
    homeScores: {},
    awayScores: {},
    submitted: false,
  };

  return (
    <div className="text-center">
      <table className="mx-auto mt-5 table col-1">
        <thead>
          <div className="col-2">
            <tr>
              <th className="day-count">Day {currentDay + 1}</th>
            </tr>
          </div>
        </thead>
        <tbody>
          {filteredMatches.map((match) => {
            // Assuming match.date is in the format "DD MMM"
            const [day, month] = match.date.split(" ");
            const year = new Date().getFullYear(); // Assuming the current year

            // Getting the month index (0-based) based on the month abbreviation
            const monthIndex = new Date(
              Date.parse(`${month} 1, 2000`)
            ).getMonth();

            // Constructing the date string in MM/DD/YYYY format
            const formattedDate = `${monthIndex + 1}/${day}/${year}`;
            console.log("formatted date", formattedDate);

            // Constructing the full datetime string for comparison
            const matchDateTime = new Date(`${formattedDate} ${match.time}`);
            console.log("current date", new Date());
            console.log("Has the game started?", new Date() >= matchDateTime);

            return (
              <MatchRow
                key={match.match_id}
                match={match}
                homeScore={currentScores.homeScores[match.match_id]}
                awayScore={currentScores.awayScores[match.match_id]}
                onHomeScoreChange={(score) =>
                  handleHomeScoreChange(match.match_id, score)
                }
                onAwayScoreChange={(score) =>
                  handleAwayScoreChange(match.match_id, score)
                }
                hasStarted={new Date() >= matchDateTime}
              />
            );
          })}
        </tbody>
      </table>
      <div className="col-6 mx-auto matches-alert">
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
      <div>
        <div className="button-container">
          {currentDay > 0 && (
            <Button color="success" onClick={handleLastDay}>
              Last Day
            </Button>
          )}
          <span className="mx-2"></span>
          {currentDay < 12 && (
            <Button color="success" onClick={handleNextDay}>
              Next Day
            </Button>
          )}
        </div>

        <div className="button-container-submit">
          <Button color="success button-hover btn-lg" onClick={handleSubmit}>
            {"Submit Day " + (currentDay + 1)}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Matches;
