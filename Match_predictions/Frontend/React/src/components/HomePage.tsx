import "../App.css"; // Assuming you have a CSS file for styles

const HomePage = () => {
  return (
    <div className="content-box mt-5 fly-in-homePage">
      <h1 className="white-color-text mt-5">Welcome to the match predictor</h1>
      <p className="white-color-text">
        Predict the outcome of each group stage match of 2024's EURO football
        cup. See how you compare to the other football enthusiasts in the
        leaderboard!
      </p>
    </div>
  );
};

export default HomePage;
