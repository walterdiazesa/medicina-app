import React, { useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import { SearchIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";

const custom404 = () => {
  return (
    <>
      <Head>
        <title>Flemik | Página no encontrada</title>
        <meta name="description" content="Página solicitada no encontrada" />
      </Head>
      <div
        className="flex w-full h-full absolute left-0 top-16 bg-teal-500 -z-1 justify-center items-center"
        style={{ maxHeight: "calc(100vh - 4rem)" }}
      >
        <h1 className="text-white text-xl font-bold">
          Lo sentimos, no hemos podido encontrar esta página
        </h1>
      </div>
    </>
  );
};

export default custom404;
