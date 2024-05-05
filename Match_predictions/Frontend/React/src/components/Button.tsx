type Position = "static" | "relative" | "absolute" | "sticky" | "fixed";
interface Props {
  children: string | JSX.Element;
  color: string;
  onClick: () => void;
  position?: Position;
  bottom?: string;
  left?: string;
}

const Button = ({
  children,
  onClick,
  color,
  position,
  bottom,
  left,
}: Props) => {
  const buttonStyle: React.CSSProperties = {
    position: position || "static",
    bottom: bottom || "auto",
    left: left || "auto",
  };

  return (
    <button
      className={"btn btn-" + color}
      onClick={onClick}
      style={buttonStyle}
    >
      {children}
    </button>
  );
};

export default Button;
