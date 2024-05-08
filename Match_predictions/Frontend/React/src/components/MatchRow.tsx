import React, { ChangeEvent } from "react";

type Match = [string, string, string];
interface MatchRowProps {
  match: Match;
  onHomeScoreChange: (score: string) => void;
  onAwayScoreChange: (score: string) => void;
}

const MatchRow: React.FC<MatchRowProps> = ({
  match,
  onHomeScoreChange,
  onAwayScoreChange,
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
        <input
          type="text"
          className="form-control text-center"
          style={{ width: "50px" }}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onHomeScoreChange(e.target.value)
          }
        />
      </td>
      <td className="align-middle text-center">:</td>
      <td className="align-middle text-center" style={{ width: "50px" }}>
        <input
          type="text"
          className="form-control text-center"
          style={{ width: "50px" }}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onAwayScoreChange(e.target.value)
          }
        />
      </td>
      <td className="align-middle text-center" style={{ width: "150px" }}>
        {awayTeam}
      </td>
    </tr>
  );
};

export default MatchRow;
