import React from "react";

const ButtonWithIcon = ({
  children: icon,
  text,
  className,
  onClick,
  name,
  textClassName = "",
  disabled,
}: {
  children: JSX.Element;
  text: string;
  className?: string;
  onClick?: () => void;
  name?: string;
  textClassName?: string;
  disabled?: boolean;
}) => {
  return (
    <button
      {...(name && { name })}
      onClick={onClick}
      className={`${className} ${
        disabled ? "" : "hover:bg-teal-400 hover:border-teal-500"
      } bg-teal-500  text-white font-bold ${
        !className || !className.includes("py-") ? "py-2" : ""
      } ${
        !className || !className.includes("px-") ? "px-4" : ""
      } border-b-4 border-teal-700 rounded align-middle inline-flex items-center`}
      disabled={disabled}
    >
      {icon}
      <span className={`ml-2 ${textClassName}`}>{text}</span>
    </button>
  );
};

export default ButtonWithIcon;
