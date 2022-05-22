/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from "react";
import Navbar from "./Navbar";

const index = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
  const [isAuth, setAuth] = useState(false);
  return (
    <>
      <Navbar isAuth={isAuth} setAuth={setAuth} />
      {children}
    </>
  );
};

export default index;
