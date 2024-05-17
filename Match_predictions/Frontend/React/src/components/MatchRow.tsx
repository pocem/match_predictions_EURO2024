import React, { ChangeEvent } from "react";

type Match = [string, string, string];
interface MatchRowProps {
  match: Match;
  homeScore: number;
  awayScore: number;
  onHomeScoreChange: (score: string) => void;
  onAwayScoreChange: (score: string) => void;
  scoresSubmitted: boolean;
}

const MatchRow: React.FC<MatchRowProps> = ({
  match,
  homeScore,
  awayScore,
  onHomeScoreChange,
  onAwayScoreChange,
  scoresSubmitted,
}) => {
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
        {scoresSubmitted ? (
          <span>{homeScore}</span>
        ) : (
          <input
            type="text"
            className="form-control text-center"
            style={{ width: "50px" }}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onHomeScoreChange(e.target.value)
            }
          />
        )}
      </td>
      <td className="align-middle text-center">:</td>
      <td className="align-middle text-center" style={{ width: "50px" }}>
        {scoresSubmitted ? (
          <span>{awayScore}</span>
        ) : (
          <input
            type="text"
            className="form-control text-center"
            style={{ width: "50px" }}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onAwayScoreChange(e.target.value)
            }
          />
        )}
      </td>
      <td className="align-middle text-center" style={{ width: "150px" }}>
        {awayTeam}
      </td>
    </tr>
  );
};

export default MatchRow;
