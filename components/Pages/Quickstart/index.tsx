import Link from "next/link";
import Image from "next/image";
import React from "react";
import {
  InformationCircleIcon,
  ShieldCheckIcon,
} from "@heroicons/react/outline";

const index = () => {
  return (
    <>
      <p className="rounded-lg py-2 px-4 bg-teal-500 text-white mt-2 mb-4 text-justify">
        <InformationCircleIcon className="h-5 w-5 inline-flex -translate-y-0.5" />{" "}
        Esta sección es de utilidad para configurar la comunicación entre tu{" "}
        <b>transformador</b> y tu <b>equipo analizador de química sanguínea</b>{" "}
        por tu cuenta, aún así sugerimos fuertemente{" "}
        <Link href="/pricing">
          <b className="cursor-pointer text-teal-contrast hover:text-teal-700">
            adquirir un plan
          </b>
        </Link>{" "}
        que permita que un especialista realice este procedimiento por tí.
      </p>
      <p className="my-2">
        <b>1-</b> Una vez tengas tu cuenta creada, dirígete a{" "}
        <Link href="/listener">
          <b className="cursor-pointer text-teal-500 hover:text-teal-300">
            transformadores
          </b>
        </Link>
      </p>
      <p>
        <b>2-</b> Dentro, encontrarás una lista de transformadores por cada uno
        de los laboratorios de los que formes parte
      </p>
      <Image
        src="/pages/QuickStart/ListenersPage.jpg"
        width="441"
        height="210"
        alt="lista_de_transformadores"
        objectFit="contain"
        quality={100}
        priority
        className="mb-2"
      />
      <p className="mb-1">
        <b>3-</b> Descarga y ejecuta el transformador correspondiente al
        laboratorio con el que desees escuchar los exámenes procesados por un
        equipo analizador de química sanguínea
      </p>
      <Image
        src="/pages/QuickStart/ListenerDownloaded.jpg"
        width="235"
        height="56"
        alt="transformador_descargado"
        objectFit="contain"
        quality={100}
        priority
        className="mb-2"
      />
      <p className="mt-2 mb-1">
        <b>4-</b> Al abrir el ejecutable Windows preguntará si deseas permitir
        el acceso para el transformador, este mensaje solo se mostrará una vez,
        deberás dar clic en{" "}
        <span className="inline-flex items-baseline">
          <ShieldCheckIcon className="h-5 w-5 mr-0.5 translate-y-1" />
          <b>Permitir acceso</b>
        </span>
        , si quieres conocer más acerca de la seguridad o los permisos de los
        transformadores haz clic{" "}
        <Link href="/about-listener">
          <b className="cursor-pointer text-teal-500 hover:text-teal-300">
            aquí
          </b>
        </Link>
      </p>
      <Image
        src="/pages/QuickStart/ListenerNetworkAccess.jpg"
        width="980"
        height="511"
        alt="permisos_transformador"
        objectFit="contain"
        quality={100}
        priority
        className="mb-2"
      />
      <p className="my-2">
        <b>5-</b> Conecta tu equipo analizador de química sanguínea a la misma
        red del ordenador/laptop en el que esté siendo ejecutado el
        transformador, puedes lograr esto con cualquiera de las siguientes
        opciones
      </p>
      <p className="pl-4 my-2">
        5.1- Puedes conectar tu equipo analizador de química sanguínea por cable
        UTP directamente al ordenador <b>(Método recomendado)</b>
      </p>
      <p className="pl-4 my-2">
        5.2- Puedes conectar tu equipo analizador de química sanguínea por cable
        UTP al mismo router/modem/teléfono con datos que esté conectado (por
        WiFi o cable) el ordenador
      </p>
      <p className="pl-4 my-2">
        5.3- Si tu equipo analizador de química sanguínea, posee conexión por
        WiFi, puedes conectarlo por WiFi al router/modem/teléfono con datos que
        esté conectado (por WiFi o cable) el ordenador
      </p>
      <p className="my-2">
        <b>6-</b> En tu equipo analizador de química sanguínea busca la
        configuración de red (Dependiendo de la marca y modelo de tu equipo,
        puede estar en distintos lugares), por lo general pedirá de 2 a 4 campos
      </p>
      <p className="pl-4 my-2">
        6.1- Para campos relacionados a la <b>IP</b>, escribe en el equipo el
        número (incluyendo los puntos &quot;.&quot;) que muestre tu
        transformador antes de los dos puntos &quot;:&quot; (El número encima de
        la línea roja en la próxima imagen, varía dependiendo de la red que
        estés usando)
      </p>
      <p className="pl-4 my-2">
        6.2- Para campos relacionados al <b>puerto</b>, escribe los números que
        muestre tu transformador (El número encima de la línea amarilla en la
        próxima imagen)
      </p>
      <p className="pl-4 my-2">
        6.3- Algunos equipos pedirán un campo relacionado a la{" "}
        <b>puerta de enlace predeterminada</b>, coloca el mismo número que
        ocupaste para la IP, cambiando el último número (El último número
        después del último punto &quot;.&quot; dentro de la IP) por un
        &quot;1&quot;
      </p>
      <p className="pl-4 my-2">
        6.4- Algunos equipos pedirán un campo relacionado a la{" "}
        <b>máscara de subred</b>, para este campo siempre será del valor
        &quot;255.255.255.0&quot;
      </p>
      <Image
        src="/pages/QuickStart/ListenerToChemConfig.jpg"
        width="345"
        height="76"
        alt="configuracion_transformador"
        objectFit="contain"
        quality={100}
        priority
        className="mb-2"
      />
      <p className="mt-2 mb-8">
        <b>7-</b> Empieza a procesar exámenes en tu equipo analizador de química
        seca, los exámenes serán automáticamente procesados y se mostrarán en
        tiempo real en la página de{" "}
        <Link href="/test">
          <b className="cursor-pointer text-teal-500 hover:text-teal-300">
            tests
          </b>
        </Link>
      </p>
    </>
  );
};

export default index;
