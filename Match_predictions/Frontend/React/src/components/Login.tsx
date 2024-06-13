// LoginForm.tsx
import { useState, ChangeEvent, FormEvent } from "react";
import Button from "./Button.tsx";

interface LoginFormProps {
  onLoginSuccess: (name: string) => void;
}

function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [unsuccessfulMessage, setUnsuccessfulMessage] = useState("");
  const [loggedInUserName, setLoggedInUserName] = useState<string | null>(null);

  const handleLoginSuccess = () => {
    onLoginSuccess(name);
    setLoggedInUserName(name);
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async () => {
    if (name === "") {
      setUnsuccessfulMessage("Enter your name.");
      return;
    }

    if (password === "") {
      setUnsuccessfulMessage("Enter your password.");
      return;
    }

    const formData = {
      name: name,
      password: password,
    };

    try {
      const response = await fetch(
        "https://matchpredict-f88c889f1126.herokuapp.com/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        setUnsuccessfulMessage("Name or password don't match");
        throw new Error("Network response was not ok");
      }

      // Redirect to the next page after successful login
      setSuccessMessage("Login successful");
      handleLoginSuccess();

      setTimeout(() => {
        setFormSubmitted(true);
      }, 3000);

      setUnsuccessfulMessage("");
    } catch (error) {
      console.error("Error:", error);
      // Handle error
    }
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit();
  };

  const handleAnimationEnd = (message: string) => {
    // Remove the alert message immediately after the animation completes
    if (message === successMessage) {
      setSuccessMessage("");
    } else if (message === unsuccessfulMessage) {
      setUnsuccessfulMessage("");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-6">
          {successMessage && (
            <div
              className="alert alert-success fade-in-out"
              role="alert"
              onAnimationEnd={() => handleAnimationEnd(successMessage)}
            >
              {successMessage}
            </div>
          )}
          {unsuccessfulMessage && (
            <div className="alert alert-danger" role="alert">
              {unsuccessfulMessage}
            </div>
          )}

          <div className="white-color-text right-side bg-success p1 rounded col-6">
            {loggedInUserName && <h3>Logged as '{loggedInUserName}'</h3>}
          </div>
        </div>
      </div>
      {!formSubmitted && (
        <form onSubmit={handleFormSubmit}>
          <div className="container-md mt-1">
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
            <Button
              color="btn btn-success btn-lg mt-3 button-hover"
              onClick={handleSubmit}
            >
              Login
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

export default LoginForm;
