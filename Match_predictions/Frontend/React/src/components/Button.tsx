type Position = "static" | "relative" | "absolute" | "sticky" | "fixed";

interface Props {
  children: string | JSX.Element;
  color: string;
  onClick: () => void;
  position?: Position;
  bottom?: string;
  left?: string;
  type?: "button" | "submit" | "reset"; // Add type property
}

const Button = ({
  children,
  onClick,
  color,
  position,
  bottom,
  left,
  type = "button", // Set default value for type
}: Props) => {
  const buttonStyle: React.CSSProperties = {
    position: position || "static",
    bottom: bottom || "auto",
    left: left || "auto",
  };

  return (
    <button
      type={type} // Use type attribute
      className={"btn btn-" + color}
      onClick={onClick}
      style={buttonStyle}
    >
      {children}
    </button>
  );
};

export default Button;
