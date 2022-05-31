/* eslint-disable react-hooks/rules-of-hooks */
import { DownloadIcon, XCircleIcon } from "@heroicons/react/outline";
import React, { useEffect, useState } from "react";
import { URLSearchParams } from "url";
import { getLaboratories } from "../../axios/Lab";
import { ButtonWithIcon } from "../../components";
import { Spinner } from "../../components/Icons";
import { listen, unListen } from "../../socketio";
import { Lab } from "../../types/Prisma";

const index = () => {
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

  listen("installer_created", (args) => {
    const { lab, signedUrl }: { lab: string; signedUrl: string } = args[0];
    setInstallers((_installers) => {
      if (!_installers || !_installers.length) return _installers;
      const updatedInstallers = [..._installers];
      const updatedLabIdx = updatedInstallers.findIndex(({ id }) => id === lab);
      if (updatedLabIdx !== -1)
        updatedInstallers[updatedLabIdx].installer = signedUrl;
      return updatedInstallers;
    });
  });

  return (
    <div className="mt-2 md:mt-8">
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
        installers.map(({ installer, name }) => (
          <div
            key={name}
            className="flex items-center justify-center md:justify-start"
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
        ))
      )}
    </div>
  );
};

export default index;
