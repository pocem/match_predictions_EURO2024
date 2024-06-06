import React, { ChangeEvent } from "react";

interface Match {
  match_id: number;
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
}

interface MatchRowProps {
  match: Match;
  homeScore: number;
  awayScore: number;
  onHomeScoreChange: (score: string) => void;
  onAwayScoreChange: (score: string) => void;

  hasStarted: boolean;
}

const MatchRow: React.FC<MatchRowProps> = ({
  match,
  homeScore,
  awayScore,
  onHomeScoreChange,
  onAwayScoreChange,

  hasStarted,
}) => {
  const { homeTeam, awayTeam, date, time } = match;

  return (
    <tr>
      <th scope="row" className="align-middle text-center">
        {date}
      </th>
      <td className="align-middle text-center">{time}</td>
      <td
        className="align-middle text-center team-name"
        style={{ width: "150px" }}
      >
        {homeTeam}
      </td>
      <td className="align-middle text-center" style={{ width: "50px" }}>
        {hasStarted ? (
          <span>{homeScore !== undefined ? homeScore.toString() : "-"}</span>
        ) : (
          <input
            type="text"
            className="form-control score-input"
            value={homeScore !== undefined ? homeScore.toString() : ""}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onHomeScoreChange(e.target.value)
            }
          />
        )}
      </td>
      <td className="align-middle text-center">:</td>
      <td className="align-middle text-center" style={{ width: "50px" }}>
        {hasStarted ? (
          <span>{awayScore !== undefined ? awayScore.toString() : "-"}</span>
        ) : (
          <input
            type="text"
            className="form-control score-input"
            value={awayScore !== undefined ? awayScore.toString() : ""}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onAwayScoreChange(e.target.value)
            }
          />
        )}
      </td>
      <td
        className="align-middle text-center team-name"
        style={{ width: "150px" }}
      >
        {awayTeam}
      </td>
    </tr>
  );
};

export default MatchRow;
