import React from "react";

const index = ({
  icon,
  placeholder,
  name,
  type,
  className = "",
  multiline = false,
}: {
  icon?: JSX.Element;
  placeholder: string;
  name: string;
  type: React.HTMLInputTypeAttribute;
  className?: string;
  multiline?: boolean;
}) => {
  return (
    <div
      className={`${className} block relative text-gray-400 focus-within:text-gray-600 w-full`}
    >
      {!multiline ? (
        <input
          type={type}
          name={name}
          className="py-1.5 text-sm text-gray-400 rounded-md pr-8 pl-3 border-2 border-gray focus:border-gray-600 focus:border-opacity-40 focus:outline-none bg-white focus:text-gray-600 w-full"
          placeholder={placeholder}
          autoComplete="off"
        />
      ) : (
        <textarea
          rows={5}
          name={name}
          className="no-scrollbar resize-none py-1.5 text-sm text-gray-400 rounded-md pr-8 pl-3 border-2 border-gray focus:border-gray-600 focus:border-opacity-40 focus:outline-none bg-white focus:text-gray-600 w-full"
          placeholder={placeholder}
          autoComplete="off"
        />
      )}
      {icon && (
        <span className="absolute inset-y-0 right-0 flex items-center pr-3">
          {icon}
        </span>
      )}
    </div>
  );
};

export default index;
