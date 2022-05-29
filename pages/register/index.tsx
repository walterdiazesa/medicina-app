/* eslint-disable react-hooks/rules-of-hooks */
import {
  AtSymbolIcon,
  EyeIcon,
  EyeOffIcon,
  FingerPrintIcon,
  GlobeAltIcon,
  KeyIcon,
  LocationMarkerIcon,
  OfficeBuildingIcon,
  PhoneIcon,
  PhoneIncomingIcon,
} from "@heroicons/react/outline";
import React, { useEffect } from "react";
import { createLaboratory } from "../../axios/Lab";
import { ButtonWithIcon, Input } from "../../components";
import { auth as tryAuth } from "../../axios/Auth";
import { Auth } from "../../types/Auth";
import { useRouter } from "next/router";

const index = ({
  auth,
  setAuth,
}: {
  auth: Auth;
  setAuth: React.Dispatch<React.SetStateAction<Auth>>;
}) => {
  const router = useRouter();

  useEffect(() => {
    if (auth) {
      router.replace("/profile");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth]);

  return (
    <>
      <form
        className="mt-2 md:mt-8"
        onSubmit={async (eForm) => {
          const optionalFields = new Set(["web"]);
          eForm.preventDefault();
          const form = eForm.target as HTMLFormElement;
          const formData = new FormData(form);
          let isInvalidForm: { field: HTMLInputElement } | false = false;
          const labFields = Object.fromEntries(formData);
          if (Object.keys(labFields).length !== 8)
            return alert("Falta algún valor, por favor recarga la página");
          formData.forEach((value, key, field) => {
            if (isInvalidForm) return;
            if (!optionalFields.has(key) && !value.toString().trim())
              return (isInvalidForm = {
                field: form.querySelector(`[name="${key}"]`)!,
              });
          });
          if (isInvalidForm) {
            (isInvalidForm as { field: HTMLInputElement }).field.focus();
            return alert("No puedes dejar ningún campo vacío");
          }
          const { created, data } = await createLaboratory(labFields);

          if (!created) return alert(JSON.stringify(data));

          const auth = await tryAuth();
          setAuth(auth);
          //setTimeout(() => router.replace("/profile"), 0);
        }}
      >
        <h2 className="text-xl font-semibold text-gray-600">
          Cuéntanos sobre tu laboratorio
        </h2>
        <h3 className="md:flex items-center text-lg text-gray-400 md:text-gray-300 border-b-2 border-gray-300 border-opacity-30 md:max-w-max">
          <span className="hidden md:flex items-center">
            <EyeIcon className="text-gray-300 h-5 w-5 mr-1.5" />
            Contacto
          </span>
          <span className="text-sm md:text-base md:ml-1">
            (Información pública, mostrada en los reportes generados)
          </span>
        </h3>
        <Input
          type="text"
          name="name"
          placeholder="Nombre del laboratorio"
          className="max-w-xl my-2"
          icon={<FingerPrintIcon className="text-gray-400 h-5 w-5" />}
        />
        <Input
          type="text"
          name="address"
          placeholder="Dirección del laboratorio"
          className="max-w-xl my-2"
          icon={<LocationMarkerIcon className="text-gray-400 h-5 w-5" />}
        />
        <Input
          type="text"
          name="publicPhone"
          placeholder="Teléfono de contacto"
          className="max-w-xl my-2"
          icon={<PhoneIcon className="text-gray-400 h-5 w-5" />}
        />
        <Input
          type="text"
          name="publicEmail"
          placeholder="Correo de contacto"
          className="max-w-xl my-2"
          icon={<AtSymbolIcon className="text-gray-400 h-5 w-5" />}
        />
        <p className="text-sm text-gray-500">
          ¿Tienes un sitio web? (Google, Facebook, Instagram)
        </p>
        <Input
          type="text"
          name="web"
          placeholder="Link de la página web"
          className="max-w-xl mt-0.5 mb-2"
          icon={<GlobeAltIcon className="text-gray-400 h-5 w-5" />}
        />
        <h3 className="md:flex items-center text-lg text-gray-400 md:text-gray-300 border-b-2 border-gray-300 border-opacity-30 md:max-w-max">
          <span className="hidden md:flex items-center">
            <EyeOffIcon className="text-gray-300 h-5 w-5 mr-1.5" />
            Credenciales
          </span>
          <span className="text-sm md:text-base md:ml-1">
            (Información privada, usada para iniciar sesión)
          </span>
        </h3>
        <Input
          type="text"
          name="email"
          placeholder="Correo electrónico"
          className="max-w-xl my-2"
          icon={<AtSymbolIcon className="text-gray-400 h-5 w-5" />}
        />
        <Input
          type="password"
          name="password"
          placeholder="Contraseña"
          className="max-w-xl my-2"
          icon={<KeyIcon className="text-gray-400 h-5 w-5" />}
        />
        <p className="text-sm text-gray-500">
          En caso necesitemos contactarnos contigo
        </p>
        <Input
          type="text"
          name="phone"
          placeholder="Teléfono"
          className="max-w-xl mt-0.5 mb-2"
          icon={<PhoneIncomingIcon className="text-gray-400 h-5 w-5" />}
        />
        <ButtonWithIcon
          text="Registrar Laboratorio"
          className="w-full mt-2 md:max-w-xl"
        >
          <OfficeBuildingIcon className="text-white h-5 w-5" />
        </ButtonWithIcon>
      </form>
      <button
        onClick={() => {
          // @ts-ignore
          document.getElementsByName("name")[0].value = "Test Lab 2";
          // @ts-ignore
          document.getElementsByName("address")[0].value =
            "Calle La Mascota, Edificio Pharma, Piso 13, Local 5";
          // @ts-ignore
          document.getElementsByName("publicPhone")[0].value =
            "(503) 2294-5356";
          // @ts-ignore
          document.getElementsByName("publicEmail")[0].value =
            "contact@testlab2.com";
          // @ts-ignore
          document.getElementsByName("email")[0].value = "testlab2@gmail.com";
          // @ts-ignore
          document.getElementsByName("password")[0].value = "vapuesdiego";
          // @ts-ignore
          document.getElementsByName("phone")[0].value = "78034257";
        }}
      >
        MockFill
      </button>
    </>
  );
};

export default index;