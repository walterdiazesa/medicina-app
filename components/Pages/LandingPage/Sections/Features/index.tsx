import {
  CloudIcon,
  CubeTransparentIcon,
  ShieldCheckIcon,
} from "@heroicons/react/outline";
import React, { useState, useRef, useEffect } from "react";
import Transition from "../../../../Transition";
import Carousel from "./Carousel";

function Features() {
  const [tab, setTab] = useState(1);

  const tabs = useRef<HTMLDivElement>(null);

  /* const heightFix = () => {
    if (tabs.current!.children[tab]) {
      tabs.current!.style.height =
        (tabs.current!.children[tab - 1] as HTMLDivElement).offsetHeight + "px";
    }
  };

  useEffect(() => {
    heightFix();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]); */

  const [isTabHumanInteracted, setTabHumanInteracted] = useState(false);

  useEffect(() => {
    const changeTabsTimer = setInterval(
      () =>
        !isTabHumanInteracted &&
        setTab((_tab) => {
          if (_tab === 3) return 1;
          return ++_tab;
        }),
      5000
    );
    return () => clearInterval(changeTabsTimer);
  }, [isTabHumanInteracted]);

  useEffect(() => {
    let tabHumanInteractedShutdown: NodeJS.Timeout;
    if (isTabHumanInteracted)
      tabHumanInteractedShutdown = setTimeout(() => {
        setTab((_tab) => {
          if (_tab === 3) return 1;
          return ++_tab;
        });
        setTabHumanInteracted(false);
      }, 8000);
    return () => clearTimeout(tabHumanInteractedShutdown);
  }, [isTabHumanInteracted]);

  return (
    <section className="relative">
      <div
        className="absolute inset-0 bg-gradient-to-tr from-teal-200 to-teal-500 pointer-events-none mb-16 animate-fade"
        aria-hidden="true"
      />
      <div className="animate-on-scroll relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="pt-3">
          <div className="max-w-3xl mx-auto text-center pb-10">
            <h1 className="text-3xl font-bold mb-4 text-white">
              Mejoramos tu productividad, reducimos costos
            </h1>
            <p className="text-teal-contrast text-justify">
              <b>Flemik</b> es la solución que capta los datos transmitidos por
              un analizador de química sanguínea, los cifra con la más reciente
              tecnología de encriptación y los envía a nuestro servidor el cúal
              transforma al instante los datos del analizador en texto
              comprensible para nuestros clientes, pudiendo visualizarlo en
              nuestra web, sin importar el dispositivo y transformarlo
              directamente en un archivo PDF con una gran variedad de
              personalizaciones para adaptarnos a los estándares de tu
              laboratorio, firmarlo, sellarlo digitalmente y directamente
              compartirlo con el paciente si así lo deseas.
            </p>
          </div>
          <div className="md:grid md:grid-cols-12 md:gap-6">
            <div
              className="max-w-xl md:max-w-none md:w-full mx-auto md:col-span-7 lg:col-span-6 md:mt-6"
              data-aos="fade-right"
            >
              <div className="mb-8 md:mb-0">
                <a
                  className={`flex items-center text-lg p-5 rounded border transition duration-300 ease-in-out mb-3 ${
                    tab !== 1
                      ? "bg-white shadow-md border-gray-200 hover:shadow-lg"
                      : "bg-gray-200 border-transparent"
                  }`}
                  href="#0"
                  onClick={(e) => {
                    e.preventDefault();
                    setTabHumanInteracted(true);
                    setTab(1);
                  }}
                >
                  <div>
                    <div className="font-bold leading-snug tracking-tight mb-1 text-justify">
                      Protocolos de seguridad
                    </div>
                    <div className="text-base text-gray-600 text-justify">
                      Protege los datos de tu laboratorio con los más recientes
                      avances en criptografía, usados por las más grandes
                      empresas alrededor del mundo.
                    </div>
                  </div>
                  <div className="flex justify-center items-center w-8 h-8 bg-white rounded-full shadow flex-shrink-0 ml-3">
                    <ShieldCheckIcon className="h-5 w-5 text-current" />
                  </div>
                </a>
                <a
                  className={`flex items-center text-lg p-5 rounded border transition duration-300 ease-in-out mb-3 ${
                    tab !== 2
                      ? "bg-white shadow-md border-gray-200 hover:shadow-lg"
                      : "bg-gray-200 border-transparent"
                  }`}
                  href="#0"
                  onClick={(e) => {
                    e.preventDefault();
                    setTabHumanInteracted(true);
                    setTab(2);
                  }}
                >
                  <div>
                    <div className="font-bold leading-snug tracking-tight mb-1 text-justify">
                      Tus datos en la nube
                    </div>
                    <div className="text-base text-gray-600 text-justify">
                      Maneja tus datos de forma digital, minimizando cualquier
                      error humano, agílizando tener que editar de forma manual
                      y teniendo un respaldo en la nube.
                    </div>
                  </div>
                  <div className="flex justify-center items-center w-8 h-8 bg-white rounded-full shadow flex-shrink-0 ml-3">
                    <CloudIcon className="h-5 w-5 text-current" />
                  </div>
                </a>
                <a
                  className={`flex items-center text-lg p-5 rounded border transition duration-300 ease-in-out mb-3 ${
                    tab !== 3
                      ? "bg-white shadow-md border-gray-200 hover:shadow-lg"
                      : "bg-gray-200 border-transparent"
                  }`}
                  href="#0"
                  onClick={(e) => {
                    e.preventDefault();
                    setTabHumanInteracted(true);
                    setTab(3);
                  }}
                >
                  <div>
                    <div className="font-bold leading-snug tracking-tight mb-1 text-justify">
                      Todo tu laboratorio en la palma de tu mano
                    </div>
                    <div className="text-base text-gray-600 text-justify">
                      Accede, edita y comparte lo que necesites, con cualquier
                      dispositivo, estés donde estés.
                    </div>
                  </div>
                  <div className="flex justify-center items-center w-8 h-8 bg-white rounded-full shadow flex-shrink-0 ml-3">
                    <CubeTransparentIcon className="h-5 w-5 text-current" />
                  </div>
                </a>
              </div>
            </div>
            <Carousel tabs={tabs} tab={tab} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features;
