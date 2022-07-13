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
const SECURE_ROUTES_REGEX = new Set([
  /register\/\w*/,
  /test\/[a-f\d]{24}(?:[?]access=)\w*/i,
]);

const index = ({ children }: { children: JSX.Element }) => {
  const router = useRouter();
  const [auth, setAuth] = useState<Auth>(null);

  // Manage Auth
  useEffect(() => {
    tryAuth().then((_auth) => {
      if (_auth) return setAuth(_auth);

      if (
        !Array.from(SECURE_ROUTES_REGEX).some((value) =>
          value.test(router.asPath)
        ) &&
        !SECURE_ROUTES.has(router.pathname)
      )
        router.replace("/");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // Secure routes
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (
        !Array.from(SECURE_ROUTES_REGEX).some((value) => value.test(url)) &&
        !SECURE_ROUTES.has(url) &&
        !auth
      )
        router.replace("/");
    };

    router.events.on("beforeHistoryChange", handleRouteChange);

    return () => {
      router.events.off("beforeHistoryChange", handleRouteChange);
    };
  }, [auth, router, router.pathname]);

  return (
    <div id="mainLayout">
      <div id="blurLayoutModal" className="duration-200">
        <Navbar isAuth={auth} setAuth={setAuth} />
        {!auth &&
        !SECURE_ROUTES.has(router.pathname) &&
        !Array.from(SECURE_ROUTES_REGEX).some((value) =>
          value.test(router.asPath)
        ) ? (
          <div className="min-w-full min-h-screen-navbar flex justify-center items-center -translate-y-16 pt-16">
            <Spinner size="big" color="text-gray-300" />
          </div>
        ) : (
          <div
            className={`min-w-full min-h-[calc(100vh-8rem)] ${
              !["/", "/register", "/register/[hash]"].includes(
                router.pathname
              ) && "px-2 md:px-8"
            } pt-16`}
          >
            {{ ...children, props: { ...children.props, auth, setAuth } }}
          </div>
        )}
      </div>
    </div>
  );
};

export default index;
