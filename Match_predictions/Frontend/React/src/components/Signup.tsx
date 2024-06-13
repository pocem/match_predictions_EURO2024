import { useState, ChangeEvent, FormEvent } from "react";
import "../App.css";

function SignUpForm() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [team, setTeam] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [unsuccessfulMessage, setUnsuccessfulMessage] = useState("");

  const countries = [
    "Albania",
    "Austria",
    "Belgium",
    "Croatia",
    "Czechia",
    "Denmark",
    "England",
    "France",
    "Georgia",
    "Germany",
    "Hungary",
    "Italy",
    "Netherlands",
    "Poland",
    "Portugal",
    "Romania",
    "Scotland",
    "Serbia",
    "Slovakia",
    "Slovenia",
    "Spain",
    "Switzerland",
    "Turkey",
    "Ukraine",
  ];

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleAgeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAge(e.target.value);
  };

  const handleTeamChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setTeam(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Clear previous messages
    setUnsuccessfulMessage("");
    setSuccessMessage("");

    if (name === "") {
      setUnsuccessfulMessage("Enter a name.");
      return;
    }

    if (password.length < 8) {
      setUnsuccessfulMessage("Password must contain at least 8 characters.");
      return;
    }
    if (age === "") {
      setUnsuccessfulMessage("Enter valid age.");
      return;
    }
    if (team === "") {
      setUnsuccessfulMessage("Enter the team you support.");
      return;
    }

    const formData = {
      name: name,
      password: password,
      age: age,
      team: team,
    };

    try {
      const response = await fetch(
        "https://matchpredict-f88c889f1126.herokuapp.com/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      console.log("Response status:", response.status); // Add this line

      if (!response.ok) {
        const errorData = await response.json();
        setUnsuccessfulMessage(errorData.error || "An error occurred.");
        throw new Error("Network response was not ok");
      }

      // Redirect to the next page after successful signup
      setSuccessMessage("Signup successful! Login to make your predictions!");
      setFormSubmitted(true); // Set success message
    } catch (error) {
      console.error("Error:", error);
      // Handle error
    }
  };

  return (
    <div className="container mt-5 ">
      <div className="row justify-content-center">
        <div className="col-6">
          {/* Adjust the column width as needed */}
          {successMessage && (
            <div className="alert alert-success" role="alert">
              {successMessage}
            </div>
          )}
          {!successMessage && unsuccessfulMessage && (
            <div className="alert alert-danger" role="alert">
              {unsuccessfulMessage}
            </div>
          )}
        </div>
      </div>
      {!formSubmitted && (
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              <input
                type="text"
                className="form-control"
                placeholder="Name"
                aria-label="Name"
                onChange={handleNameChange}
              />
            </label>
            <br />

            <label>
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                aria-label="Password"
                onChange={handlePasswordChange}
              />
            </label>
            <br />
            <label>
              <input
                type="number"
                className="form-control"
                placeholder="Age"
                aria-label="Age"
                onChange={handleAgeChange}
              />
            </label>
            <br />
            <label>
              <select
                className="form-control"
                aria-label="Team you support"
                onChange={handleTeamChange}
              >
                <option value="">Who do you support</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </label>
            <br />
            <button
              type="submit"
              className="btn btn-success btn-lg mt-3 button-hover"
            >
              Sign Up
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default SignUpForm;
