function Leaderboard() {
  return (
    <table className="table table-bordered mt-5 ">
      <thead>
        <tr>
          <th scope="col">Rank</th>
          <th scope="col">Name</th>
          <th scope="col">Age</th>
          <th scope="col">Supporting</th>
          <th scope="col">Points</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">1</th>
          <td>Zika</td>
          <td>26</td>
          <td>Bulgaria</td>
          <td>19</td>
        </tr>
      </tbody>
    </table>
  );
}

export default Leaderboard;
