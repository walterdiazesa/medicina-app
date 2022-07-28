import React from "react";
import Wave from "../components/Pages/Wave";
import Image from "next/image";
import {
  ChipIcon,
  CodeIcon,
  CubeTransparentIcon,
  LockClosedIcon,
  ShieldCheckIcon,
} from "@heroicons/react/outline";

const AboutListener = () => {
  return (
    <>
      <div className="bg-gradient-to-tr from-teal-200 to-teal-500 pt-4 md:h-52 xl:pt-12">
        <div className="md:absolute w-full flex justify-center px-4 sm:px-0 items-center z-1 xl:scale-110">
          <Image
            src="/pages/QuickStart/PersonGuide2.png"
            width="275"
            height="244"
            alt="quickstart"
            objectFit="contain"
            priority
          />
          <h1 className="text-white text-xl sm:text-2xl md:text-3xl font-semibold">
            Acerca de: Transformadores
          </h1>
        </div>
      </div>
      <Wave inverted />
      <div className="my-8 px-2 md:px-8">
        <p className="my-2 text-justify">
          Nuestro máximo aporte, el diferenciador ante la competencia, un
          <b> transformador</b> es un software que sirve de escucha para
          transmitir y procesar los exámenes leídos por un equipo analizador de
          química sanguínea, cuenta con los más altos estándares de seguridad de
          transmisión y ante cualquier ataque de ingeniería inversa.
        </p>
        <div className="my-4 flex items-center">
          <ShieldCheckIcon className="text-gray-600 h-8 min-w-8 mr-3" />
          <p className="text-justify pr-2 sm:pr-0">
            Un característica subestimada en los tiempos modernos, la
            <b> transparencia</b>; nuestro transformador no recopila ni busca
            ningún tipo de información privilegiada, tampoco necesita acceder o
            modificar a los datos de tu disco duro, lo único que nuestro
            transformador está en busca de, son exámenes que sean transmitidos
            por red en puertos específicos que los equipos analizadores de
            química sanguínea suelen utilizar, en cuanto llega cualquier otro
            tipo de dato que no presente indicio de ningún patrón conocido con
            relación a los datos de un examen, se descartará inmediatamente
          </p>
        </div>
        <div className="my-4 flex items-center">
          <CodeIcon className="text-gray-600 h-8 min-w-8 mr-3" />
          <p className="text-justify pr-2 sm:pr-0">
            El código que reside dentro de un transformador es precompilado a
            código de bytes específicamente para la plataforma deseada e
            inyectado directamente en el ejecutable, convirtiendolo en lenguaje
            máquina que hace prácticamente imposible la visualización y/o
            alteración del mismo
          </p>
        </div>
        <div className="my-4 flex items-center">
          <CubeTransparentIcon className="text-gray-600 h-8 min-w-8 mr-3" />
          <p className="text-justify pr-2 sm:pr-0">
            Aún con toda la funcionalidad dentro del mismo, hemos logrado
            condensar toda la lógica necesaria para mantener el tamaño de
            ejecutable en lo mínimo (¡alrededor de 33mb!), además de optimizar
            al máximo el ahorro y aprovechamiento de recursos, siendo
            imperceptible la diferencia en el desempeño del ordenador sin
            importar sus especificaciones técnicas
          </p>
        </div>
        <div className="my-4 flex items-center">
          <ChipIcon className="text-gray-600 h-8 min-w-8 mr-3" />
          <p className="text-justify pr-2 sm:pr-0">
            Si bien en la mayoría de casos el sistema operativo predilecto para
            los laboratorios es Windows (por ello nuestra decisión por defecto
            de ofrecer el transformador para la misma plataforma), solo
            necesitarás solicitar un ejecutable para cualquier otra plataforma
            (MacOS o Linux) sin importar su versión, para obtener un
            transformador que se adapte a tus necesidades
          </p>
        </div>
        <div className="my-4 flex items-center">
          <LockClosedIcon className="text-gray-600 h-8 min-w-8 mr-3" />
          <p className="text-justify pr-2 sm:pr-0">
            Finalmente, algunos de los aspectos más valiosos a tener en cuenta
            alrededor de los campos de la medicina: La{" "}
            <b>seguridad y confidencialidad</b>; nuestro transformador
            encriptará en un procedimiento minucioso de varios pasos, haciendo
            uso de varias llaves únicas por cada laboratorio, todos los datos
            sensibles de todos tus exámenes, hacíendo imposible que un intruso
            en tu red local interna pueda siquiera visualizar la data que
            nuestro transformador envie por red
          </p>
        </div>
      </div>
    </>
  );
};

export async function getStaticProps() {
  return {
    props: {},
  };
}

export default AboutListener;
