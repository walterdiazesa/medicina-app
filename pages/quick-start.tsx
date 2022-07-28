import React from "react";
import Image from "next/image";
import Wave from "../components/Pages/Wave";
import Link from "next/link";
import {
  InformationCircleIcon,
  ShieldCheckIcon,
} from "@heroicons/react/outline";
import QuickstartSteps from "../components/Pages/Quickstart";

const Quickstart = () => {
  return (
    <>
      <div className="bg-gradient-to-tr from-teal-200 to-teal-500 pt-4 md:h-52 xl:pt-12">
        <div className="md:absolute w-full flex justify-center px-4 sm:px-0 items-center z-1 xl:scale-110">
          <Image
            src="/pages/QuickStart/PersonGuide.png"
            width="275"
            height="264"
            alt="quickstart"
            objectFit="contain"
            priority
          />
          <h1 className="text-white text-xl sm:text-2xl md:text-3xl font-semibold">
            Guía de inicio rápido
          </h1>
        </div>
      </div>
      <Wave inverted />
      <div className="mt-8 px-2 md:px-8">
        <QuickstartSteps />
      </div>
    </>
  );
};

export async function getStaticProps() {
  return {
    props: {},
  };
}

export default Quickstart;
