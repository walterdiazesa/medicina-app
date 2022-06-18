/* eslint-disable react-hooks/rules-of-hooks */
import {
  DownloadIcon,
  KeyIcon,
  UserIcon,
  XCircleIcon,
} from "@heroicons/react/outline";
import { KeyIcon as KeyIconSolid } from "@heroicons/react/solid";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { URLSearchParams } from "url";
import { changePassword } from "../../axios/Auth";
import { requestPutObjectURL } from "../../axios/Files";
import { getLaboratories } from "../../axios/Lab";
import { me, updateMe } from "../../axios/User";
import { Attachment, ButtonWithIcon, Input } from "../../components";
import { Save, Spinner } from "../../components/Icons";
import { listen, unListen } from "../../socketio";
import { Auth } from "../../types/Auth";
import { Lab, User } from "../../types/Prisma";
import { ResponseError } from "../../types/Responses";

const index = ({
  auth,
  setAuth,
}: {
  auth: Auth;
  setAuth: React.Dispatch<React.SetStateAction<Auth>>;
}) => {
  const [installers, setInstallers] = useState<Lab[] | null>();
  const [profile, setProfile] = useState<User | null>();

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

    if (auth?.["sub-user"]) me().then((user) => setProfile(user));

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
        ))
      )}
      {auth?.["sub-user"] && (
        <>
          <h1 className="text-lg font-semibold mt-3 mb-2">Perfil</h1>
          {profile === undefined ? (
            <p className="text-gray-500 animate-pulse flex items-center">
              <Spinner pulse className="mr-2" color="text-gray-500" />
              Obteniendo información
            </p>
          ) : profile === null ? (
            <p className="text-red-400 flex items-center">
              <XCircleIcon className="h-6 w-6 mr-2" />
              Ocurrió un error obteniendo la información.
            </p>
          ) : (
            <>
              <p>
                ID: <span className="font-semibold">{profile.id}</span>
              </p>
              <p>
                Slug: <span className="font-semibold">{profile.slug}</span>
              </p>
              <p>
                Nombre: <span className="font-semibold">{profile.name}</span>
              </p>
              <p>
                Email: <span className="font-semibold">{profile.email}</span>
              </p>
              {profile.profileImg && (
                <div className="my-2 w-44 h-44 relative">
                  <Image
                    src={profile.profileImg}
                    alt="profile_img"
                    width={176}
                    height={176}
                    objectFit="fill"
                    priority
                    quality={100}
                  />
                </div>
              )}
              <Attachment
                key={profile.profileImg}
                label={`${
                  profile.profileImg ? "Cambia tu" : "Sube una"
                } foto de perfil`}
                className="my-1"
                iconWhenAttached={
                  <UserIcon className="w-8 h-8 text-gray-400 group-hover:text-gray-600 animate-pulse" />
                }
                onFileAttached={async (file) => {
                  if (!file.type.startsWith("image"))
                    return alert(
                      "La imagen de perfil tiene que ser un archivo de imagen."
                    );
                  const lastPayloadImg = auth.img;
                  const publicAssetUploadURL = await requestPutObjectURL();

                  try {
                    await axios.put(publicAssetUploadURL, file);
                  } catch (e) {
                    if (profile)
                      setProfile((_profile) => ({
                        ..._profile!,
                        profileImg: `${
                          _profile!.profileImg
                        }&restartFlemikComponent=${Math.random()}`,
                      }));
                    return alert("Ocurrió un problema al subir la imagen.");
                  }

                  const user = await updateMe({
                    profileImg: publicAssetUploadURL.split("?")[0],
                  });
                  if (user instanceof ResponseError)
                    return alert(JSON.stringify(user));
                  if (!profile) return;
                  setProfile((_profile) => ({
                    ..._profile!,
                    profileImg: user!.profileImg,
                  }));
                  //  || lastPayloadImg && lastPayloadImg !== user.profileImg;
                  if (!auth.img || auth["sub-lab"].length !== 1)
                    setAuth(
                      (_auth) => ({ ..._auth, img: user!.profileImg } as Auth)
                    );
                }}
              />
              <p className="mt-2">Cambiar contraseña:</p>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const formData = new FormData(form);
                  if (
                    !formData.has("oldPassword") ||
                    !formData.get("oldPassword")!.toString().trim() ||
                    !formData.has("newPassword") ||
                    !formData.get("newPassword")!.toString().trim()
                  )
                    return alert("No puedes dejar ningún campo vacío");
                  const updatedPass = await changePassword({
                    oldPassword: formData.get("oldPassword")!.toString(),
                    newPassword: formData.get("newPassword")!.toString(),
                  });
                  if (updatedPass instanceof ResponseError)
                    return alert(JSON.stringify(updatedPass));
                  alert("La contraseña ha sido actualizada correctamente");
                  (
                    form.querySelector(
                      `[name="oldPassword"]`
                    )! as HTMLInputElement
                  ).value = "";
                  (
                    form.querySelector(
                      `[name="newPassword"]`
                    )! as HTMLInputElement
                  ).value = "";
                }}
                className="sm:flex items-center"
              >
                <Input
                  type="password"
                  name="oldPassword"
                  placeholder="Introduzca su contraseña actual"
                  className="max-w-xl mr-2"
                  icon={<KeyIcon className="text-gray-400 h-5 w-5" />}
                />
                <Input
                  type="password"
                  name="newPassword"
                  placeholder="Introduzca su nueva contraseña"
                  className="max-w-xl mr-2 my-2 sm:my-0"
                  icon={<KeyIconSolid className="text-gray-400 h-5 w-5" />}
                />
                <ButtonWithIcon
                  text="Guardar"
                  className="py-1 w-full sm:w-auto"
                >
                  <Save className="w-5 h-5 fill-white" />
                </ButtonWithIcon>
              </form>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default index;
