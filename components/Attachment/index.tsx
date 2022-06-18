import React, { useState } from "react";

const index = ({
  label,
  iconWhenAttached,
  className = "",
  onFileAttached,
}: {
  label: string;
  className?: string;
  iconWhenAttached: JSX.Element;
  onFileAttached?: (file: File) => void;
}) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [imageAttached, setImageAttached] = useState<undefined | string>(
    undefined
  );

  return (
    <div className={`flex justify-center ${className}`}>
      <div className="w-full rounded-md">
        <label className="inline-block mb-2 text-sm text-gray-400">
          {label}
        </label>
        <div className="flex items-center justify-center w-full">
          <label className="flex cursor-pointer flex-col w-full h-32 border-4 border-teal-100 border-opacity-80 hover:border-opacity-100 border-dashed hover:bg-gray-100 hover:border-gray-300">
            <div className="flex flex-col items-center justify-center pt-7">
              {imageAttached ? (
                iconWhenAttached
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8 text-gray-400 group-hover:text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              )}
              <p
                className={`pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600 ${
                  imageAttached && onFileAttached && "animate-pulse"
                }`}
              >
                {(imageAttached &&
                  `${
                    onFileAttached
                      ? `Subiendo ${imageAttached}...`
                      : imageAttached
                  }`) ||
                  "Adjuntar una imagen"}
              </p>
            </div>
            <input
              type="file"
              accept="image/png, image/jpeg, image/webp"
              className="opacity-0"
              onChange={(e) => {
                setImageAttached(
                  (e.target.files && e.target.files[0].name) || undefined
                );
                if (onFileAttached && e.target.files)
                  onFileAttached(e.target.files[0]);
              }}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default index;
