import "../App.css"; // Assuming you have a CSS file for styles

const HomePage = () => {
  return (
    <div className="content-box mt-3 fly-in-homePage">
      <h1 className="white-color-text mt-3">Welcome to the match predictor</h1>
      <p className="white-color-text">
        Predict the outcome of each group stage match of 2024's EURO football
        cup. See how you compare to the other football enthusiasts in the
        leaderboard!
      </p>
      <br />
      <p className="white-color-text left-align">
        How your predictions are evaluated:
        <br />
        <b className="spacing">Correct score: 4 points</b>
        <br />
        <b className="spacing">
          Guessed it's a draw but not the correct score: 2 points
        </b>
        <br />
        <b className="spacing">
          Guessed the winner of the match but not correct score: 1 point
        </b>
        <br />
        <b className="spacing">Completely bottled it: 0 points</b>
      </p>
    </div>
  );
};

export default HomePage;
