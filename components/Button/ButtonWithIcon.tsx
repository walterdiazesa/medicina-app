import React from "react";

const ButtonWithIcon = ({
  children: icon,
  text,
  className,
  onClick,
  name,
}: {
  children: JSX.Element;
  text: string;
  className?: string;
  onClick?: () => void;
  name?: string;
}) => {
  return (
    <button
      {...(name && { name })}
      onClick={onClick}
      className={`${className} bg-teal-500 hover:bg-teal-400 text-white font-bold ${
        !className || !className.includes("py-") ? "py-2" : ""
      } ${
        !className || !className.includes("px-") ? "px-4" : ""
      } border-b-4 border-teal-700 hover:border-teal-500 rounded align-middle inline-flex items-center`}
    >
      {icon}
      <span className="ml-2">{text}</span>
    </button>
  );
};

export default ButtonWithIcon;
