/* eslint-disable react-hooks/rules-of-hooks */
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Auth } from "../../types/Auth";
import Navbar from "./Navbar";
import { auth as tryAuth } from "../../axios/Auth";

const index = ({ children }: { children: JSX.Element }) => {
  const router = useRouter();
  const [isAuth, _setAuth] = useState(false);
  const [auth, setAuth] = useState<Auth>(null);

  // Manage Auth
  useEffect(() => {
    tryAuth().then((_auth) => {
      if (_auth) setAuth(_auth);
      else router.replace("/");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // Secure routes
  useEffect(() => {
    const secureRoutes = new Set(["/"]);
    const handleRouteChange = (url: string) => {
      console.log(`App is changing to ${url}`);
      if (!secureRoutes.has(url) && !auth) router.replace("/");
    };

    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [auth, router, router.pathname]);

  return (
    <>
      <Navbar isAuth={auth} setAuth={setAuth} />
      {{ ...children, props: { ...children.props, auth } }}
    </>
  );
};

export default index;
