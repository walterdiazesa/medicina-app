import {
  ClockIcon,
  KeyIcon,
  StatusOfflineIcon,
  UserIcon,
  XCircleIcon,
} from "@heroicons/react/outline";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { ButtonWithIcon, Input } from "../../components";
import { Spinner } from "../../components/Icons";
import { Auth } from "../../types/Auth";
import { auth as tryAuth } from "../../axios/Auth";
import { create } from "../../axios/User";
import { ResponseError } from "../../types/Responses";
import { showModal } from "../../components/Modal/showModal";
import { unexpectedError } from "../../utils/Error";
import SectionPage from "../../components/Pages/SectionPage";
import Image from "next/image";

type Invitation = { email: string; labId: string };
type InvalidInvitation = { error: string; type: "timeout" | "invalid" };

const RegisterByInvite = ({
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
  const { hash } = router.query;

  const [invitation, validateInvitation] = useState<
    Invitation | InvalidInvitation
  >();

  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    if (hash)
      axios
        .post("/api/registerbyinvite", { hash })
        .then(({ data }) => {
          validateInvitation(data);
        })
        .catch((e) => {
          if (e.response.status === 410)
            return validateInvitation({
              error: e.response.data.error,
              type: "timeout",
            });
          if (e.response.status === 400)
            return validateInvitation({
              error: e.response.data.error,
              type: "invalid",
            });
        });
  }, [hash]);

  if (!invitation)
    return (
      <h1 className="mt-8 text-xl font-semibold text-gray-400 animate-pulse flex items-center justify-center min-w-full">
        <Spinner pulse color="text-gray-400" />
        Obteniendo invitación...
      </h1>
    );

  if (invitation.hasOwnProperty("error"))
    return (
      <h1 className="mt-8 text-xl font-semibold text-red-400 flex items-center justify-center min-w-full">
        {(invitation as InvalidInvitation).type === "invalid" ? (
          <StatusOfflineIcon className="h-6 w-6 mr-2" />
        ) : (
          <ClockIcon className="h-6 w-6 mr-2" />
        )}
        {(invitation as InvalidInvitation).error}
      </h1>
    );

  return (
    <SectionPage
      mobileSectionHeader={
        <div className="text-center">
          <h2 className="text-lg w-full font-bold text-gray-600 mb-2">
            Activa tu cuenta
          </h2>
          <Image
            src="/pages/Register/DoctorTest.png"
            width="207"
            height="200"
            alt="register"
            objectFit="contain"
            priority
          />
        </div>
      }
      sectionHeader={
        <>
          <h2 className="text-lg xl:text-xl font-bold text-teal-contrast antialiased">
            Recibiste una invitación
          </h2>
          <h2 className="text-2xl xl:text-4xl font-bold text-white antialiased mb-4">
            Para crear tu cuenta
          </h2>
          <Image
            src="/pages/Register/DoctorTest.png"
            width="225"
            height="315"
            alt="register"
            objectFit="contain"
            priority
          />
        </>
      }
    >
      <p className="text-center my-2">
        Creación de usuario para:{" "}
        <span className="font-semibold">
          {(invitation as Invitation).email}
        </span>
      </p>
      <form
        className="mt-3"
        onSubmit={async (eForm) => {
          eForm.preventDefault();
          const form = eForm.target as HTMLFormElement;
          const formData = new FormData(form);
          let isInvalidForm: { field: HTMLInputElement } | false = false;
          const userFields = Object.fromEntries(formData);
          if (Object.keys(userFields).length !== 2)
            return showModal({
              icon: "error",
              title: `"Falta algún valor, por favor recarga la página"`,
              buttons: "OK",
              submitButtonText: "Entendido",
            });
          formData.forEach((value, key, field) => {
            if (isInvalidForm) return;
            if (!value.toString().trim())
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
          setLoadingSubmit(true);
          const data = await create(hash as string, {
            name: userFields["name"].toString(),
            password: userFields["password"].toString(),
          });
          if (data instanceof ResponseError) {
            setLoadingSubmit(false);
            return unexpectedError(data);
          }
          const auth = await tryAuth();
          setAuth(auth);
        }}
      >
        <Input
          type="text"
          name="name"
          placeholder="Introduce tu nombre"
          className="my-2"
          autofocus
        />
        <Input
          type="password"
          name="password"
          placeholder="Contraseña"
          className="my-2"
          icon={<KeyIcon className="text-gray-400 h-5 w-5" />}
        />
        <ButtonWithIcon
          text={loadingSubmit ? "Creando cuenta" : "Registrar"}
          disabled={loadingSubmit}
          className="mt-2 w-full"
          textClassName="font-normal"
        >
          {loadingSubmit ? (
            <Spinner className="mr-1" />
          ) : (
            <UserIcon className="text-white h-5 w-5" />
          )}
        </ButtonWithIcon>
      </form>
    </SectionPage>
  );
};

export default RegisterByInvite;
