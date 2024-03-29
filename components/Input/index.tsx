import React from "react";

const index = ({
  icon,
  placeholder,
  name,
  type,
  className = "",
  multiline = undefined,
  defaultValue = undefined,
  autofocus = undefined,
  contentsize = undefined,
  disabled,
  rows,
  onChange,
}: {
  icon?: JSX.Element;
  placeholder: string;
  name: string;
  type: React.HTMLInputTypeAttribute;
  className?: string;
  defaultValue?: string;
  autofocus?: boolean;
  disabled?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
} & (
  | { multiline?: undefined; contentsize?: undefined; rows?: undefined }
  | ({ multiline: true } & (
      | { contentsize?: true; rows?: undefined }
      | { rows: number; contentsize?: undefined }
    ))
)) => {
  return (
    <div
      className={`${className} block relative text-gray-400 focus-within:text-gray-600 w-full`}
    >
      {!multiline ? (
        <input
          disabled={disabled}
          autoFocus={autofocus}
          type={type}
          name={name}
          defaultValue={defaultValue}
          className="py-1.5 text-sm text-gray-400 rounded-md pr-8 pl-3 border-2 border-gray focus:border-gray-600 focus:border-opacity-40 focus:outline-none bg-white focus:text-gray-600 w-full"
          placeholder={placeholder}
          autoComplete="off"
          {...(onChange && { onChange })}
        />
      ) : (
        <textarea
          disabled={disabled}
          rows={(contentsize && undefined) || rows || 5}
          autoFocus={autofocus}
          {...(onChange && { onChange })}
          name={name}
          defaultValue={defaultValue}
          className={`${
            contentsize ? "overflow-hidden min-h-4-25 " : ""
          }no-scrollbar resize-none py-1.5 text-sm text-gray-400 rounded-md pr-8 pl-3 border-2 border-gray focus:border-gray-600 focus:border-opacity-40 focus:outline-none bg-white focus:text-gray-600 w-full`}
          placeholder={placeholder}
          autoComplete="off"
          onKeyUp={
            contentsize
              ? (e) => {
                  const target = e.target as HTMLTextAreaElement;
                  // target.style.height = "1px";
                  target.style.height = /* 25 +  */ target.scrollHeight + "px";
                }
              : undefined
          }
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

export default React.memo(index);
