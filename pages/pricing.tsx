/* eslint-disable react-hooks/rules-of-hooks */
import {
  CheckCircleIcon,
  GiftIcon,
  ReceiptTaxIcon,
  ServerIcon,
  StarIcon,
} from "@heroicons/react/outline";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Button from "../components/Button";
import Calculator from "../components/Pages/Pricing/Calculator";
import Wave from "../components/Pages/Wave";

const pricing = ({
  chemBasePricing,
  chemPricingSteps,
}: {
  chemBasePricing: {
    curie: number;
    pasteur: number;
    fleming: number;
  };
  chemPricingSteps: {
    number: number;
    discount: number;
  }[];
}) => {
  const router = useRouter();

  return (
    <>
      <div className="my-8 text-center px-2 md:px-8">
        {router.query.campaign === "SUMMERFREEMONTH" && (
          <div className="rounded-lg my-4 py-2 flex justify-center items-center bg-teal-contrast text-white max-w-4xl mx-auto">
            <GiftIcon className="text-white h-5 w-5 mr-2" />
            Se ha aplicado un mes gratis a tu compra
          </div>
        )}
        {router.query.coupon && (
          <div className="rounded-lg my-4 py-2 flex justify-center items-center bg-teal-contrast text-white max-w-4xl mx-auto">
            <ReceiptTaxIcon className="text-white h-5 w-5 mr-2" />
            Se ha aplicado tu cupón
          </div>
        )}
        <h1 className="text-4xl font-bold text-gray-600 font-sans">
          Planes y Precios
        </h1>
        <div className="max-w-full md:max-w-6xl mx-auto my-3 md:px-8">
          <div className="relative flex flex-col md:flex-row items-center justify-center">
            <div className="w-full max-w-sm sm:w-3/5 lg:w-1/3 sm:my-5 relative z-0 rounded-lg shadow-lg md:-mr-4">
              <div className="bg-white text-black rounded-lg shadow-lg overflow-hidden">
                <div className="block text-left text-sm sm:text-md max-w-sm mx-auto mt-2 text-black px-8 lg:px-6">
                  <h1 className="text-lg font-medium uppercase p-3 pb-0 text-center tracking-wide">
                    Plan Curie
                  </h1>
                  <h2 className="text-sm text-gray-500 text-center pb-6">
                    $99.99 por equipo/mes
                  </h2>
                  El plan predilecto para probar nuestro producto, testea toda
                  su funcionalidad sin comprometerte a un largo periodo
                </div>

                <div className="flex flex-wrap mt-3 px-6">
                  <ul>
                    <li className="flex items-center text-gray-700 my-1">
                      <CheckCircleIcon className="mr-1.5 text-teal-500 h-5 min-w-5" />
                      Exámenes ilímitados
                    </li>
                    <li className="flex items-center text-gray-700 my-1">
                      <CheckCircleIcon className="mr-1.5 text-teal-500 h-5 min-w-5" />
                      Instalación y configuración de un equipo
                    </li>
                    <li className="flex items-center text-gray-700 my-1">
                      <CheckCircleIcon className="mr-1.5 text-teal-500 h-5 min-w-5" />
                      Soporte técnico (~3 días hábiles)
                    </li>
                  </ul>
                </div>
                <div className="flex items-center p-8  uppercase">
                  <Button className="mt-3 text-lg w-full px-6 py-3">
                    Seleccionar
                  </Button>
                </div>
              </div>
            </div>
            <div className="w-full max-w-md sm:w-2/3 lg:w-1/3 sm:my-5 my-6 relative z-10 bg-white rounded-lg shadow-lg">
              <div className="flex items-center justify-center text-sm leading-none rounded-t-lg bg-teal-contrast text-white font-semibold uppercase py-4 tracking-wide">
                <StarIcon className="mr-2 h-5 w-5 text-white" />
                Más popular
              </div>
              <div className="block text-left text-sm sm:text-md max-w-sm mx-auto mt-2 text-black px-8 lg:px-6">
                <h1 className="text-lg font-medium uppercase p-3 pb-0 text-center tracking-wide">
                  Plan Fleming
                </h1>
                <h2 className="text-sm text-gray-500 text-center pb-6">
                  $74.99 por equipo/mes pagando un año por adelantado
                </h2>
                Premiamos a nuestros clientes más leales,{" "}
                <b className="text-teal-contrast">ahorra el 25%</b> al elegirnos
                como la piedra angular de tu laboratorio
              </div>
              <div className="flex px-6 justify-start sm:justify-start mt-3">
                <ul>
                  <li className="flex items-center text-gray-700 my-1">
                    <CheckCircleIcon className="mr-1.5 text-teal-500 h-5 min-w-5" />
                    Exámenes ilímitados
                  </li>
                  <li className="flex text-gray-700 text-left my-1">
                    <CheckCircleIcon className="mr-1.5 text-teal-500 h-5 min-w-5 translate-y-0.5" />
                    Instalación y configuración para todos tus equipos
                  </li>
                  <li className="flex text-gray-700 text-left my-1">
                    <CheckCircleIcon className="mr-1.5 text-teal-500 h-5 min-w-5 translate-y-0.5" />
                    Soporte técnico y atención personalizada prioritaria
                  </li>
                </ul>
              </div>

              <div className="flex items-center p-8  uppercase">
                <Button className="mt-3 text-lg w-full px-6 py-3">
                  Seleccionar
                </Button>
              </div>
            </div>
            <div className="w-full max-w-sm sm:w-3/5 lg:w-1/3 sm:my-5 relative z-0 rounded-lg shadow-lg md:-ml-4">
              <div className="bg-white text-black rounded-lg shadow-lg overflow-hidden">
                <div className="block text-left text-sm sm:text-md max-w-sm mx-auto mt-2 text-black px-8 lg:px-6">
                  <h1 className="text-lg font-medium uppercase p-3 pb-0 text-center tracking-wide">
                    Plan Pasteur
                  </h1>
                  <h2 className="text-sm text-gray-500 text-center pb-6">
                    $539/equipo por 6 meses
                  </h2>
                  ¿Recién escuchas de nosotros y aún no estás seguro de
                  comprometerte por un largo tiempo, pero quieres ahorrar un
                  poco en nuestra membresía? Este plan es el balance para
                  ayudarte a empezar tu viaje
                </div>
                <div className="flex flex-wrap mt-3 px-6">
                  <ul>
                    <li className="flex items-center text-gray-700 my-1">
                      <CheckCircleIcon className="mr-1.5 text-teal-500 h-5 min-w-5" />
                      Exámenes ilímitados
                    </li>
                    <li className="flex items-center text-gray-700 my-1">
                      <CheckCircleIcon className="mr-1.5 text-teal-500 h-5 min-w-5" />
                      Instalación y configuración de un equipo
                    </li>
                    <li className="flex items-center text-gray-700 my-1">
                      <CheckCircleIcon className="mr-1.5 text-teal-500 h-5 min-w-5" />
                      Soporte técnico (~3 días hábiles)
                    </li>
                  </ul>
                </div>

                <div className="flex items-center p-8  uppercase">
                  <Button className="mt-3 text-lg w-full px-6 py-3">
                    Seleccionar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p className="mt-6 sm:mt-0">
          ¿Necesitas más? ¿Tu laboratorio tiene necesidades específicas? te
          sugerimos{" "}
          <b className="text-teal-contrast hover:text-teal-900 cursor-pointer">
            contactar con ventas
          </b>
          .
        </p>
      </div>
      {router.query.flags?.includes("calculator") && (
        <div>
          <Wave />
          <div className="w-full bg-gradient-to-tr from-teal-200 to-teal-500 text-center px-2 md:px-8 pb-8 sm:pb-16 pt-4 sm:pt-0">
            <h3 className="font-bold text-white text-3xl">
              Calculadora de precios
            </h3>
            <div className="flex justify-center">
              <p className="text-justify text-teal-contrast">
                Si no estás seguro de los costos mensuales o simplemente deseas
                conocerlos de primera mano puedes adaptar los parametros a las
                necesidades de tu laboratorio
              </p>
            </div>
            <div className="mt-4">
              <Calculator
                chemPricingSteps={chemPricingSteps}
                chemBasePricing={chemBasePricing}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export async function getStaticProps() {
  const chemBasePricing = {
    curie: 99.99,
    pasteur: 89.83,
    fleming: 74.99,
  };
  const chemPricingSteps = [
    {
      number: 1,
      discount: 0,
    },
    {
      number: 2,
      discount: 20,
    },
    {
      number: 3,
      discount: 20,
    },
    {
      number: 4,
      discount: 20,
    },
    {
      number: 5,
      discount: 20,
    },
    {
      number: 6,
      discount: 15,
    },
    {
      number: 7,
      discount: 15,
    },
    {
      number: 8,
      discount: 15,
    },
    {
      number: 9,
      discount: 15,
    },
    {
      number: 10,
      discount: 15,
    },
    {
      number: 11,
      discount: 10,
    },
    {
      number: 12,
      discount: 10,
    },
    {
      number: 13,
      discount: 10,
    },
    {
      number: 14,
      discount: 10,
    },
    {
      number: 15,
      discount: 10,
    },
  ];
  return {
    props: {
      chemBasePricing,
      chemPricingSteps,
    },
  };
}

export default dynamic(() => Promise.resolve(pricing), {
  ssr: false,
});
