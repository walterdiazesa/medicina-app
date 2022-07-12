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
      router.replace("/profile");
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
    <div className="mt-8">
      <p>
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
          className="max-w-xl my-2"
          autofocus
        />
        <Input
          type="password"
          name="password"
          placeholder="Contraseña"
          className="max-w-xl my-2"
          icon={<KeyIcon className="text-gray-400 h-5 w-5" />}
        />
        <ButtonWithIcon
          text={loadingSubmit ? "Creando cuenta" : "Registrar"}
          disabled={loadingSubmit}
          className="w-full mt-2 md:max-w-xl"
        >
          {loadingSubmit ? (
            <Spinner className="mr-1" />
          ) : (
            <UserIcon className="text-white h-5 w-5" />
          )}
        </ButtonWithIcon>
      </form>
    </div>
  );
};

export default RegisterByInvite;
