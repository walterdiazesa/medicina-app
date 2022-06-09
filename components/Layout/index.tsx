/* eslint-disable react-hooks/rules-of-hooks */
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Auth } from "../../types/Auth";
import Navbar from "./Navbar";
import { auth as tryAuth } from "../../axios/Auth";
import { Spinner } from "../Icons";

const SECURE_ROUTES = new Set([
  "/",
  "/pricing",
  "/register",
  "/register/[hash]",
  "/_error",
]);
const SECURE_ROUTES_REGEX = new Set([/register\/\w*/]);

const index = ({ children }: { children: JSX.Element }) => {
  const router = useRouter();
  const [auth, setAuth] = useState<Auth>(null);

  // Manage Auth
  useEffect(() => {
    tryAuth().then((_auth) => {
      if (_auth) setAuth(_auth);
      else if (!SECURE_ROUTES.has(router.pathname)) router.replace("/");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // Secure routes
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      let regexRoute = false;
      SECURE_ROUTES_REGEX.forEach((value) => {
        if (regexRoute) return;
        if (value.test(url)) regexRoute = true;
      });
      if (!regexRoute && !SECURE_ROUTES.has(url) && !auth) router.replace("/");
    };

    router.events.on("beforeHistoryChange", handleRouteChange);

    return () => {
      router.events.off("beforeHistoryChange", handleRouteChange);
    };
  }, [auth, router, router.pathname]);

  return (
    <>
      <Navbar isAuth={auth} setAuth={setAuth} />
      {!auth && !SECURE_ROUTES.has(router.pathname) ? (
        <div className="min-w-full min-h-screen-navbar flex justify-center items-center -translate-y-16">
          <Spinner size="big" color="text-gray-300" />
        </div>
      ) : (
        <div className="min-w-full min-h-[calc(100vh-8rem)] px-2 md:px-8">
          {{ ...children, props: { ...children.props, auth, setAuth } }}
        </div>
      )}
    </>
  );
};

export default index;
