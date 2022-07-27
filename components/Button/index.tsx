import React from "react";

const Button = ({
  children,
  className,
  onClick,
  name,
  disabled,
}: {
  children: string;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  name?: string;
  disabled?: boolean;
}) => {
  return (
    <button
      {...(name && { name })}
      onClick={onClick}
      className={`${className} ${
        disabled
          ? ""
          : className && className.search(/bg|border/) !== -1
          ? ""
          : "hover:bg-teal-400 hover:border-teal-500"
      } text-white font-bold ${
        !className || !className.includes("py-") ? "py-2" : ""
      } ${!className || !className.includes("px-") ? "px-4" : ""} border-b-4 ${
        !className || className.search(/bg|border/) === -1
          ? "bg-teal-500 border-teal-700"
          : ""
      } rounded align-middle inline-flex items-center justify-center`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
