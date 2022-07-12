/* eslint-disable react-hooks/rules-of-hooks */
import {
  DownloadIcon,
  FingerPrintIcon,
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
import { showModal } from "../../components/Modal/showModal";
import { listen, unListen } from "../../socketio";
import { Auth } from "../../types/Auth";
import { Lab, User } from "../../types/Prisma";
import { ResponseError } from "../../types/Responses";
import { unexpectedError } from "../../utils/Error";

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
                    return showModal({
                      icon: "error",
                      title:
                        "La imagen de perfil tiene que ser un archivo de imagen.",
                      timer: 1500,
                    });
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
                    return showModal({
                      icon: "error",
                      title: "Ocurrió un problema al subir la imagen.",
                      timer: 1500,
                    });
                  }

                  const user = await updateMe({
                    profileImg: publicAssetUploadURL.split("?")[0],
                  });
                  if (user instanceof ResponseError)
                    return unexpectedError(user);
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

              <div className="my-4">
                <p>Firma:</p>
                {profile.signature && (
                  <div className="my-2 w-[300px] h-[150px] relative">
                    <Image
                      src={profile.signature}
                      alt="user_signature"
                      width={300}
                      height={150}
                      objectFit="fill"
                      priority
                      quality={100}
                    />
                  </div>
                )}
                <Attachment
                  key={profile.signature}
                  label={`${profile.signature ? "Actualiza" : "Sube"} tu firma`}
                  className="my-1"
                  iconWhenAttached={
                    <FingerPrintIcon className="w-8 h-8 text-gray-400 group-hover:text-gray-600 animate-pulse" />
                  }
                  onFileAttached={async (file) => {
                    if (!file.type.startsWith("image"))
                      return showModal({
                        icon: "error",
                        title: "La firma tiene que ser un archivo de imagen.",
                        timer: 1500,
                      });

                    // const signature = await toBase64(file);
                    const signatureFormData = new FormData();
                    signatureFormData.append("signature", file);
                    const user = await updateMe(signatureFormData);
                    if (user instanceof ResponseError)
                      return unexpectedError(user);
                    if (!profile) return;
                    setProfile((_profile) => ({
                      ..._profile!,
                      signature: user!.signature,
                    }));
                  }}
                />
              </div>
              <div className="my-4">
                <p>Sello:</p>
                {profile.stamp && (
                  <div className="my-2 w-[600px] h-[250px] relative">
                    <Image
                      src={profile.stamp}
                      alt="user_stamp"
                      width={600}
                      height={250}
                      objectFit="fill"
                      priority
                      quality={100}
                    />
                  </div>
                )}
                <Attachment
                  key={profile.stamp}
                  label={`${profile.stamp ? "Actualiza" : "Sube"} tu sello`}
                  className="my-1"
                  iconWhenAttached={
                    <FingerPrintIcon className="w-8 h-8 text-gray-400 group-hover:text-gray-600 animate-pulse" />
                  }
                  onFileAttached={async (file) => {
                    if (!file.type.startsWith("image"))
                      return showModal({
                        icon: "error",
                        title: "El sello tiene que ser un archivo de imagen.",
                        timer: 1500,
                      });

                    // const signature = await toBase64(file);
                    const stampFormData = new FormData();
                    stampFormData.append("stamp", file);
                    const user = await updateMe(stampFormData);
                    if (user instanceof ResponseError)
                      return unexpectedError(user);
                    if (!profile) return;
                    setProfile((_profile) => ({
                      ..._profile!,
                      stamp: user!.stamp,
                    }));
                  }}
                />
              </div>

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
                    return showModal({
                      icon: "error",
                      title: `No puedes dejar ningún campo vacío`,
                      buttons: "OK",
                      submitButtonText: "Entendido",
                    });
                  const updatedPass = await changePassword({
                    oldPassword: formData.get("oldPassword")!.toString(),
                    newPassword: formData.get("newPassword")!.toString(),
                  });
                  if (updatedPass instanceof ResponseError)
                    return unexpectedError(updatedPass);
                  showModal({
                    icon: "success",
                    body: "La contraseña ha sido actualizada correctamente",
                    timer: 1500,
                  });
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
