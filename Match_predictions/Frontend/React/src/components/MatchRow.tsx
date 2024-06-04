import React, { ChangeEvent } from "react";

interface Match {
  match_id: number;
  homeTeam: string;
  awayTeam: string;
  date: string;
}

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
  const { homeTeam, awayTeam, date } = match;

  return (
    <tr>
      <th scope="row" className="align-middle text-center">
        {date}
      </th>
      <td
        className="align-middle text-center team-name"
        style={{ width: "150px" }}
      >
        {homeTeam}
      </td>
      <td className="align-middle text-center" style={{ width: "50px" }}>
        <input
          type="text"
          className="form-control score-input"
          value={homeScore !== undefined ? homeScore.toString() : ""}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onHomeScoreChange(e.target.value)
          }
          disabled={scoresSubmitted}
        />
      </td>
      <td className="align-middle text-center">:</td>
      <td className="align-middle text-center" style={{ width: "50px" }}>
        <input
          type="text"
          className="form-control score-input"
          value={awayScore !== undefined ? awayScore.toString() : ""}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onAwayScoreChange(e.target.value)
          }
          disabled={scoresSubmitted}
        />
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
