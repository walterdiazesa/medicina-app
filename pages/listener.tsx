/* eslint-disable react-hooks/rules-of-hooks */
import { DownloadIcon, XCircleIcon } from "@heroicons/react/outline";
import React, { useEffect, useState } from "react";
import { getLaboratories } from "../axios/Lab";
import { ButtonWithIcon } from "../components";
import { Spinner } from "../components/Icons";
import { listen, unListen } from "../socketio";
import { Auth } from "../types/Auth";
import { Lab } from "../types/Prisma/Lab";
import Quickstart from "../components/Pages/Quickstart";

const listener = ({
  auth,
  setAuth,
}: {
  auth: Auth;
  setAuth: React.Dispatch<React.SetStateAction<Auth>>;
}) => {
  const [installers, setInstallers] = useState<Lab[] | null>();

  useEffect(() => {
    // 3600 = servidor.LISTENER_SIGNED_URL_EXPIRE
    getLaboratories({ fields: { installer: true, name: true, id: true } }).then(
      (_installers) => setInstallers(_installers)
    );
    const revalidateListenersSignedUrls = setInterval(
      () =>
        getLaboratories({
          fields: { installer: true, name: true, id: true },
        }).then((_installers) => setInstallers(_installers)),
      3600 * 1000
    );

    return () => {
      unListen("installer_created");
      clearInterval(revalidateListenersSignedUrls);
    };
  }, []);

  listen(
    "installer_created",
    ([{ lab, signedUrl }]: { lab: string; signedUrl: string }[]) => {
      setInstallers((_installers) => {
        if (!_installers || !_installers.length) return _installers;
        const updatedInstallers = [..._installers];
        const updatedLabIdx = updatedInstallers.findIndex(
          ({ id }) => id === lab
        );
        if (updatedLabIdx !== -1)
          updatedInstallers[updatedLabIdx].installer = signedUrl;
        return updatedInstallers;
      });
    }
  );

  return (
    <div className="my-2 md:my-8 max-w-6xl">
      <h1 className="text-lg font-semibold mb-2">Instaladores</h1>
      {installers === undefined ? (
        <p className="text-gray-500 animate-pulse flex items-center">
          <Spinner pulse className="mr-2" color="text-gray-500" />
          Obteniendo instaladores
        </p>
      ) : installers === null ? (
        <p className="text-red-400 flex items-center">
          <XCircleIcon className="h-6 w-6 mr-2" />
          Ocurrió un error obteniendo los instaladores.
        </p>
      ) : !installers.length ? (
        <p className="text-gray-700 flex items-center">
          No estás afiliado a ningún laboratorio.
        </p>
      ) : (
        <>
          {installers.map(({ installer, name }) => (
            <div
              key={name}
              className="flex items-center justify-center md:justify-start my-2"
            >
              <p className="mr-2 font-bold text-gray-700">{name}:</p>
              {installer === "generating" ? (
                <p className="ml-2 text-gray-500 animate-pulse flex items-center cursor-default">
                  <Spinner pulse color="text-gray-500" />
                  Generando...
                </p>
              ) : (
                <a href={installer!} download>
                  <ButtonWithIcon text="Descargar" className="py-1">
                    <DownloadIcon className="text-white h-5 w-5" />
                  </ButtonWithIcon>
                </a>
              )}
            </div>
          ))}
          <h2 className="mt-8 mb-4 text-lg font-semibold">
            ¿No sabes qué hacer?
            <span className="ml-1 text-teal-500">Guía de inicio rápido:</span>
          </h2>
          <Quickstart />
        </>
      )}
    </div>
  );
};

export default listener;
