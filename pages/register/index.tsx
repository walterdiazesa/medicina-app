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
import React, { useEffect, useState } from "react";
import { createLaboratory } from "../../axios/Lab";
import { Attachment, ButtonWithIcon, Input } from "../../components";
import { auth as tryAuth } from "../../axios/Auth";
import { Auth } from "../../types/Auth";
import { useRouter } from "next/router";
import { showModal } from "../../components/Modal/showModal";
import { unexpectedError } from "../../utils/Error";
import Image from "next/image";
import Wave from "../../components/Pages/Wave";
import SectionPage from "../../components/Pages/SectionPage";
import { requestPutObjectURL } from "../../axios/Files";
import axios from "axios";
import { isValidEmail } from "../../utils/Email";

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
      router.replace("/listener");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth]);

  const [labTmpImg, setLabTmpImg] = useState("");

  return (
    <SectionPage
      mobileSectionHeader={
        <div className="text-center">
          <h2 className="text-lg w-full font-bold text-gray-600 mb-3">
            Registra tu laboratorio
          </h2>
          <Image
            src="/pages/Register/LabTest.png"
            width="181"
            height="175"
            alt="register"
            objectFit="contain"
            priority
          />
        </div>
      }
      sectionHeader={
        <>
          <h2 className="text-lg xl:text-xl font-bold text-teal-contrast antialiased">
            ¿Nuevo por aquí?
          </h2>
          <h2 className="text-2xl xl:text-4xl font-bold text-white antialiased mb-4">
            Registra tu laboratorio
          </h2>
          <Image
            src="/pages/Register/LabTest.png"
            width="275"
            height="264"
            alt="register"
            objectFit="contain"
            priority
          />
        </>
      }
    >
      <form
        className="mt-2 mb-8"
        onSubmit={async (eForm) => {
          const optionalFields = new Set(["web"]);
          eForm.preventDefault();
          const form = eForm.target as HTMLFormElement;
          const formData = new FormData(form);
          let isInvalidForm: { field: HTMLInputElement } | false = false;
          const labFields = Object.fromEntries(formData);
          if (Object.keys(labFields).length !== 8)
            return showModal({
              icon: "error",
              title: `"Falta algún valor, por favor recarga la página"`,
              buttons: "OK",
              submitButtonText: "Entendido",
            });
          formData.forEach((value, key, field) => {
            if (isInvalidForm) return;
            if (!optionalFields.has(key) && !value.toString().trim())
              return (isInvalidForm = {
                field: form.querySelector(`[name="${key}"]`)!,
              });
          });
          if (isInvalidForm) {
            (isInvalidForm as { field: HTMLInputElement }).field.focus();
            return showModal({
              icon: "error",
              title: `No puedes dejar ningún campo vacío`,
              buttons: "OK",
              submitButtonText: "Entendido",
            });
          }
          if (!labTmpImg)
            return showModal({
              icon: "error",
              title: `Sube la imagen de tu laboratorio`,
              body: "Debes de subir una <b>imagen, logo o banner de tu laboratorio</b>, la cual será indispensable para mostrar en los reportes generados",
              buttons: "OK",
              submitButtonText: "Entendido",
            });
          labFields["img"] = labTmpImg;

          if (!isValidEmail(labFields.email.toString().trim())) {
            (form.querySelector(`[name="email"]`) as HTMLInputElement).focus();
            return showModal({
              icon: "error",
              title: "El correo proporcionado no es válido",
              buttons: "OK",
              submitButtonText: "Entendido",
            });
          }

          const { created, data } = await createLaboratory(labFields);

          if (!created) return unexpectedError(data);

          const auth = await tryAuth();
          setAuth(auth);
          //setTimeout(() => router.replace("/profile"), 0);
        }}
      >
        <h2 className="hidden md:block text-lg lg:text-xl w-full text-center mb-4 font-semibold text-gray-600">
          Cuéntanos sobre tu laboratorio
        </h2>
        <h3 className="md:flex items-end text-base text-gray-400">
          <span className="hidden lg:flex items-center translate-y-px">
            <EyeIcon className="text-gray-400 h-5 w-5 mr-1.5" />
            Información de contacto
          </span>
          <span className="text-sm md:ml-1">
            (Información pública, mostrada en los reportes generados)
          </span>
        </h3>
        {labTmpImg && (
          <div className="sm:my-2 max-h-44 h-44 relative">
            <Image
              src={labTmpImg}
              alt="lab_img"
              layout="fill"
              objectFit="contain"
              priority
              quality={100}
            />
          </div>
        )}
        <Attachment
          key={labTmpImg}
          fieldSize={labTmpImg ? "mini" : "normal"}
          label={`${
            labTmpImg ? "Cambia la" : "Sube una"
          } foto para tu laboratorio`}
          labelClassName="text-gray-600"
          className="my-1"
          iconWhenAttached={
            <OfficeBuildingIcon
              className={`${
                labTmpImg ? "h-5 w-5" : "w-8 h-8"
              } text-gray-400 group-hover:text-gray-600 animate-pulse`}
            />
          }
          onFileAttached={async (file) => {
            if (!file.type.startsWith("image"))
              return showModal({
                icon: "error",
                title:
                  "La imagen del laboratorio tiene que ser un archivo de imagen.",
                timer: 1500,
              });
            const publicAssetUploadURL = await requestPutObjectURL();

            try {
              await axios.put(publicAssetUploadURL, file);
            } catch (e) {
              setLabTmpImg("");
              return showModal({
                icon: "error",
                title: "Ocurrió un problema al subir la imagen.",
                timer: 1500,
              });
            }

            setLabTmpImg(publicAssetUploadURL.split("?")[0]);
          }}
        />
        <Input
          type="text"
          name="name"
          placeholder="Nombre del laboratorio"
          className="my-2"
          icon={<FingerPrintIcon className="text-gray-400 h-5 w-5" />}
        />
        <Input
          type="text"
          name="address"
          placeholder="Dirección del laboratorio"
          className="my-2"
          icon={<LocationMarkerIcon className="text-gray-400 h-5 w-5" />}
        />
        <Input
          type="text"
          name="publicPhone"
          placeholder="Teléfono de contacto"
          className="my-2"
          icon={<PhoneIcon className="text-gray-400 h-5 w-5" />}
        />
        <Input
          type="text"
          name="publicEmail"
          placeholder="Correo de contacto"
          className="my-2"
          icon={<AtSymbolIcon className="text-gray-400 h-5 w-5" />}
        />
        <p className="text-sm text-gray-500">
          ¿Tienes un sitio web? (Google, Facebook, Instagram)
        </p>
        <Input
          type="text"
          name="web"
          placeholder="Link de la página web"
          className="mt-0.5 mb-2"
          icon={<GlobeAltIcon className="text-gray-400 h-5 w-5" />}
        />
        <h3 className="mt-4 md:flex items-end text-base text-gray-400">
          <span className="hidden lg:flex items-center translate-y-px">
            <EyeOffIcon className="text-gray-400 h-5 w-5 mr-1.5" />
            Credenciales
          </span>
          <span className="text-sm md:ml-1">
            (Información privada, usada para iniciar sesión)
          </span>
        </h3>
        <Input
          type="text"
          name="email"
          placeholder="Correo electrónico"
          className="my-2"
          icon={<AtSymbolIcon className="text-gray-400 h-5 w-5" />}
        />
        <Input
          type="password"
          name="password"
          placeholder="Contraseña"
          className="my-2"
          icon={<KeyIcon className="text-gray-400 h-5 w-5" />}
        />
        <p className="text-sm text-gray-500">
          En caso necesitemos contactarnos contigo
        </p>
        <Input
          type="text"
          name="phone"
          placeholder="Teléfono"
          className="mt-0.5 mb-2"
          icon={<PhoneIncomingIcon className="text-gray-400 h-5 w-5" />}
        />
        <ButtonWithIcon
          text="Registrar Laboratorio"
          className="w-full mt-2"
          textClassName="font-normal"
        >
          <OfficeBuildingIcon className="text-white h-5 w-5" />
        </ButtonWithIcon>
      </form>
    </SectionPage>
  );
};

export default index;
