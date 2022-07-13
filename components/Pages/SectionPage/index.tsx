import React from "react";
import Wave from "../Wave";

const index = ({
  children,
  mobileSectionHeader,
  sectionHeader,
}: {
  children: JSX.Element | JSX.Element[];
  mobileSectionHeader: JSX.Element;
  sectionHeader: JSX.Element;
}) => {
  return (
    <div className="w-screen md:flex items-center">
      <div className="hidden md:block w-2/5 bg-gradient-to-br from-teal-200 to-teal-600">
        <div className="absolute min-h-screen-navbar w-2/5 overflow-hidden">
          <div id="orbreg1" className="orb-reg top-9 left-5" />
          <div id="orbreg2" className="orb-reg bottom-5 right-2" />
        </div>
        <div className="glass-xl flex flex-col items-center justify-center min-h-screen-navbar">
          {sectionHeader}
        </div>
      </div>
      <div className="block md:hidden mt-4">{mobileSectionHeader}</div>
      <div className="md:w-3/5 px-4 md:p-8">{children}</div>
    </div>
  );
};

export default index;
