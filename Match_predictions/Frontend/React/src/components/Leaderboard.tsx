import { useState, useEffect } from "react";

function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [loggedInUserName, setLoggedInUserName] = useState<string | null>(null);

  const handleLeaderboard = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/leaderboard", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setLeaderboardData(data.leaderboardData);
      setLoggedInUserName(data.loggedInUserName);
      console.log("Data from backend:", data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    handleLeaderboard();
  }, []);

  return (
    <table className="table table-bordered mt-5 text-center">
      <thead>
        <tr>
          <th scope="col">Rank 🏆</th>
          <th scope="col">Name</th>
          <th scope="col">Points</th>
          <th scope="col">Age</th>
          <th scope="col">Supporting</th>
        </tr>
      </thead>
      <tbody>
        {leaderboardData.map((entry, index) => (
          <tr
            key={index}
            className={entry.name === loggedInUserName ? "table-success" : ""}
          >
            <td>{entry.rank}</td>
            <td>{entry.name}</td>
            <td>{entry.points}</td>
            <td>{entry.age}</td>
            <td>{entry.supporting_team}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Leaderboard;
