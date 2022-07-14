/* eslint-disable react-hooks/rules-of-hooks */
import {
  FingerPrintIcon,
  KeyIcon,
  UserIcon,
  XCircleIcon,
} from "@heroicons/react/outline";
import { KeyIcon as KeyIconSolid } from "@heroicons/react/solid";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { changePassword } from "../../axios/Auth";
import { requestPutObjectURL } from "../../axios/Files";
import { me, updateMe } from "../../axios/User";
import { Attachment, ButtonWithIcon, Input } from "../../components";
import { Save, Spinner } from "../../components/Icons";
import { showModal } from "../../components/Modal/showModal";
import { Auth } from "../../types/Auth";
import { User } from "../../types/Prisma";
import { ResponseError } from "../../types/Responses";
import { unexpectedError } from "../../utils/Error";

const index = ({
  auth,
  setAuth,
}: {
  auth: Auth;
  setAuth: React.Dispatch<React.SetStateAction<Auth>>;
}) => {
  const [profile, setProfile] = useState<User | null>();

  useEffect(() => {
    if (auth?.["sub-user"]) me().then((user) => setProfile(user));
  }, []);

  return (
    <div className="my-2 md:my-8 max-w-6xl">
      {auth?.["sub-user"] && (
        <>
          <h1 className="text-lg font-semibold mb-2">Perfil</h1>
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
