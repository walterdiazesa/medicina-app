import React, { useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import { SearchIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import Link from "next/link";

const custom404 = () => {
  return (
    <>
      <Head>
        <title>Flemik | Página no encontrada</title>
        <meta name="description" content="Página solicitada no encontrada" />
      </Head>
      <div className="inset-0 absolute bg-gradient-to-br from-teal-300 to-teal-700">
        <div className="absolute w-full h-full flex justify-center items-center">
          <h1 className="text-teal-contrast text-9xl sm:text-[15rem] font-bold translate-x-4 translate-y-4 floating">
            4
          </h1>
          <div className="min-w-[200px] min-h-[200px] mx-8">
            <div
              id="notfoundorbbackground"
              className="rounded-full w-36 h-36 sm:min-w-[200px] sm:min-h-[200px] bg-teal-contrast opacity-25"
            ></div>
          </div>
          <h1 className="text-teal-contrast text-9xl sm:text-[15rem] font-bold translate-x-4 translate-y-4 floating">
            4
          </h1>
        </div>
        <div className="glass-xl flex flex-col justify-center items-center w-full h-full">
          <div className="flex justify-center items-center">
            <h1 className="text-white text-9xl sm:text-[15rem] font-bold">4</h1>
            <div className="animate-spinorb">
              <div
                id="notfoundorb"
                className="w-36 h-36 sm:w-[200px] sm:h-[200px] relative flex items-center mx-8"
              >
                <Image
                  src="/CovidOrb.png"
                  alt="orb"
                  width={200}
                  height={200}
                  objectFit="fill"
                  priority
                  quality={100}
                  className=""
                />
              </div>
            </div>
            <h1 className="text-white text-9xl sm:text-[15rem] font-bold">4</h1>
          </div>
          <p className="text-teal-contrast text-lg mt-6 sm:mt-0">
            Página no encontrada, regresar a{" "}
            <Link href="/">
              <b className="cursor-pointer hover:text-slate-600">inicio</b>
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default custom404;
