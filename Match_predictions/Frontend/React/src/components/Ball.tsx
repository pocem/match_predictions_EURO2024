import React, { useEffect } from "react";

const Ball: React.FC = () => {
  useEffect(() => {
    const ball = document.getElementById("football");
    if (ball) {
      // Set initial random position
      setRandomPosition(ball);

      ball.addEventListener("click", kickBall);
    }

    return () => {
      if (ball) {
        ball.removeEventListener("click", kickBall);
      }
    };
  }, []);

  const setRandomPosition = (ball: HTMLElement) => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Generate random coordinates within the viewport boundaries
    const randomX = Math.floor(
      Math.random() * (viewportWidth - ball.offsetWidth)
    );
    const randomY = Math.floor(
      Math.random() * (viewportHeight - ball.offsetHeight)
    );

    // Set the ball's position
    ball.style.top = `${randomY}px`;
    ball.style.left = `${randomX}px`;
  };

  const kickBall = () => {
    const ball = document.getElementById("football");
    if (ball) {
      setRandomPosition(ball);

      // Generate a random number between 0 and 1
      const randomDirection = Math.random();
      // Set animation direction based on the random number
      ball.style.animationDirection =
        randomDirection < 0.5 ? "normal" : "reverse";
    }
  };

  return (
    <img
      id="football"
      src="src/images/ball.png"
      alt="Football"
      style={{ width: "50px", height: "50px" }}
    />
  );
};

export default Ball;
