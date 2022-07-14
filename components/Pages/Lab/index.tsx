/* eslint-disable react-hooks/rules-of-hooks */
import {
  AtSymbolIcon,
  FingerPrintIcon,
  OfficeBuildingIcon,
  UserAddIcon,
} from "@heroicons/react/outline";
import React, { useEffect, useState } from "react";
import { ResponseError } from "../../../types/Responses";
import ButtonWithIcon from "../../Button/ButtonWithIcon";
import { EmployeeCard } from "../../Card";
import { Spinner } from "../../Icons";
import { showModal } from "../../Modal/showModal";
import { patchUsers as inviteUser, updateLab } from "../../../axios/Lab";
import { Switch } from "@headlessui/react";
import Input from "../../Input";
import axios from "axios";
import { requestPutObjectURL } from "../../../axios/Files";
import Attachment from "../../Attachment";
import Image from "next/image";
import { LabWithEmployeeInfo, UserType } from "../../../types/Prisma";
import { Auth } from "../../../types/Auth";
import Transition from "../../Transition";
import Dropdown from "../../Dropdown";
import { normalizeTestCustomId } from "../../../types/Test";
import { unexpectedError } from "../../../utils/Error";

const index = ({
  lab,
  setLabInfo,
  labInfo,
  labIdx,
  auth,
  setAuth,
}: {
  lab: LabWithEmployeeInfo;
  setLabInfo: React.Dispatch<
    React.SetStateAction<LabWithEmployeeInfo[] | null | undefined>
  >;
  labInfo: LabWithEmployeeInfo[];
  labIdx: number;
  auth: Auth;
  setAuth: React.Dispatch<React.SetStateAction<Auth>>;
}) => {
  const [updatingLabPreferences, setUpdatingLabPreferences] = useState(false);
  const [useCustomTestId, setUseCustomTestId] = useState(
    !!lab.preferences.useTestCustomId
  );
  const [useQR, setUseQR] = useState(!!lab.preferences.useQR);

  useEffect(() => {
    if (useCustomTestId === Boolean(lab.preferences.useTestCustomId)) return;
    (async () => {
      setUpdatingLabPreferences(true);
      const labRequest = await updateLab(lab.id, {
        preferences: { ...lab.preferences, useTestCustomId: !!useCustomTestId },
      });
      setUpdatingLabPreferences(false);
      if (labRequest instanceof ResponseError)
        return unexpectedError(labRequest);
      setLabInfo((_labInfo) => {
        const newLabInfo = [..._labInfo!];
        newLabInfo[labIdx].preferences.useTestCustomId = useCustomTestId;
        return newLabInfo;
      });
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useCustomTestId]);

  useEffect(() => {
    if (useQR === Boolean(lab.preferences.useQR)) return;
    (async () => {
      setUpdatingLabPreferences(true);
      const labRequest = await updateLab(lab.id, {
        preferences: { ...lab.preferences, useQR },
      });
      setUpdatingLabPreferences(false);
      if (labRequest instanceof ResponseError)
        return unexpectedError(labRequest);
      setLabInfo((_labInfo) => {
        const newLabInfo = [..._labInfo!];
        newLabInfo[labIdx].preferences.useQR = useQR;
        return newLabInfo;
      });
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useQR]);

  const [loadingInviteEmployee, setLoadingInviteEmployee] = useState(false);

  return (
    <div key={lab.id}>
      <p>
        Nombre: <span className="font-semibold">{lab.name}</span>
      </p>
      <p>
        Email en reporte:{" "}
        <span className="font-semibold">{lab.publicEmail}</span>
      </p>
      <p>
        Teléfono en reporte:{" "}
        <span className="font-semibold">{lab.publicPhone}</span>
      </p>
      <p>
        Dirección en reporte:{" "}
        <span className="font-semibold">{lab.address}</span>
      </p>
      {lab.img && (
        <div className="my-2 max-h-44 h-44 relative">
          <Image
            src={lab.img}
            alt="profile_img"
            layout="fill"
            objectFit="contain"
            priority
            quality={100}
          />
        </div>
      )}
      <Attachment
        key={lab.img}
        label={`${lab.img ? "Cambia la" : "Sube una"} foto para ${
          labInfo.length === 1 ? "tu" : "este"
        } laboratorio`}
        className="my-1"
        iconWhenAttached={
          <OfficeBuildingIcon className="w-8 h-8 text-gray-400 group-hover:text-gray-600 animate-pulse" />
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
            setLabInfo((_labInfo) => {
              const _labs = [..._labInfo!];
              _labs[labIdx].img = `${
                lab.img
              }&restartFlemikComponent=${Math.random()}`;
              return _labs;
            });
            return showModal({
              icon: "error",
              title: "Ocurrió un problema al subir la imagen.",
              timer: 1500,
            });
          }

          const labRequest = await updateLab(lab.id, {
            img: publicAssetUploadURL.split("?")[0],
          });
          if (labRequest instanceof ResponseError)
            return unexpectedError(labRequest);
          setLabInfo((_labInfo) => {
            const _labs = [..._labInfo!];
            _labs[labIdx].img = labRequest!.img;
            return _labs;
          });
          if (labInfo.length === 1)
            setAuth((_auth) => ({ ..._auth, img: labRequest.img } as Auth));
        }}
      />
      <div className="my-4">
        <p>Firma:</p>
        {lab.signature && (
          <div className="my-2 w-[300px] h-[150px] relative">
            <Image
              src={lab.signature}
              alt="lab_signature"
              width={300}
              height={150}
              objectFit="fill"
              priority
              quality={100}
            />
          </div>
        )}
        <Attachment
          key={lab.signature}
          label={`${lab.signature ? "Actualiza" : "Sube"} tu firma`}
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
            const labRequest = await updateLab(lab.id, signatureFormData);
            if (labRequest instanceof ResponseError)
              return unexpectedError(labRequest);
            if (!labInfo) return;
            setLabInfo((_labInfo) => {
              const _labs = [..._labInfo!];
              _labs[labIdx].signature = labRequest.signature;
              return _labs;
            });
          }}
        />
      </div>
      <div className="my-4">
        <p>Sello:</p>
        {lab.stamp && (
          <div className="my-2 w-[600px] h-[250px] relative">
            <Image
              src={lab.stamp}
              alt="lab_stamp"
              width={600}
              height={250}
              objectFit="fill"
              priority
              quality={100}
            />
          </div>
        )}
        <Attachment
          key={lab.stamp}
          label={`${lab.stamp ? "Actualiza" : "Sube"} tu sello`}
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
            const labRequest = await updateLab(lab.id, stampFormData);
            if (labRequest instanceof ResponseError)
              return unexpectedError(labRequest);
            if (!labInfo) return;
            setLabInfo((_labInfo) => {
              const _labs = [..._labInfo!];
              _labs[labIdx].stamp = labRequest.stamp;
              return _labs;
            });
          }}
        />
      </div>
      <h1 className="text-lg font-semibold mb-2">Preferencias</h1>
      <div className="sm:flex items-center">
        <p className="font-semibold sm:mr-4">Tipo de ID para los exámenes:</p>
        <Switch.Group>
          <div className="flex items-center">
            <Switch.Label
              passive
              className={`mr-3.5 ${
                useCustomTestId
                  ? "text-gray-500 font-medium"
                  : "text-gray-700 font-semibold"
              } text-sm flex`}
            >
              <span className="hidden sm:block">Por defecto &#40;</span>
              62902398718cd67f60f86ef2
              <span className="hidden sm:block">&#41;</span>
            </Switch.Label>
            <Switch
              checked={useCustomTestId}
              onChange={() =>
                setUseCustomTestId((_useCustomTestId) => !_useCustomTestId)
              }
              className={`${updatingLabPreferences && "pointer-events-none"} ${
                useCustomTestId ? "bg-teal-500" : "bg-gray-200"
              } focus:outline-none relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
            >
              <span
                className={`${
                  useCustomTestId ? "translate-x-6" : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
            <Switch.Label
              passive
              className={`ml-3.5 ${
                !useCustomTestId
                  ? "text-gray-500 font-medium"
                  : "text-gray-700 font-semibold"
              } text-sm flex`}
            >
              <span className="hidden sm:block">Personalizada &#40;</span>
              {normalizeTestCustomId(
                1,
                lab.preferences.leadingZerosWhenCustomId!
              )}
              <span className="hidden sm:block">&#41;</span>
            </Switch.Label>
          </div>
        </Switch.Group>
      </div>
      <Transition
        key={String(lab.preferences.useTestCustomId)}
        isOpen={useCustomTestId}
      >
        <div className="sm:flex items-center my-2">
          <p className="font-semibold sm:mr-4">
            Cantidad de ceros antes de la parte entera:
          </p>
          <Dropdown
            className={`z-1 w-52 ${
              updatingLabPreferences && "pointer-events-none"
            }`}
            name="leading_zeros_customtestid"
            placeholder="Selecciona la cantidad de zeros"
            items={Array.from({ length: "2147483647".length }, (_, i) => ({
              text: !i ? "Únicamente parte entera" : String(i),
              value: String(i + 1),
            }))}
            defaultValue={{
              text:
                lab.preferences.leadingZerosWhenCustomId === 1
                  ? "Únicamente parte entera"
                  : String(lab.preferences.leadingZerosWhenCustomId! - 1),
              value: String(lab.preferences.leadingZerosWhenCustomId),
            }}
            limit
            onChangeValue={async (value) => {
              const leadingZerosWhenCustomId = parseInt(value);
              if (
                lab.preferences.leadingZerosWhenCustomId ===
                leadingZerosWhenCustomId
              )
                return;
              setUpdatingLabPreferences(true);
              const labRequest = await updateLab(lab.id, {
                preferences: {
                  ...lab.preferences,
                  leadingZerosWhenCustomId,
                },
              });
              setUpdatingLabPreferences(false);
              if (labRequest instanceof ResponseError)
                return unexpectedError(labRequest);
              setLabInfo((_labInfo) => {
                const newLabInfo = [..._labInfo!];
                newLabInfo[labIdx].preferences.leadingZerosWhenCustomId =
                  leadingZerosWhenCustomId;
                return newLabInfo;
              });
            }}
          />
        </div>
      </Transition>
      <div className="flex items-center my-2">
        <p className="font-semibold sm:mr-4">Usar código QR:</p>
        <Switch.Group>
          <div className="flex items-center">
            <Switch
              checked={useQR}
              onChange={() => setUseQR((_useQR) => !_useQR)}
              className={`${updatingLabPreferences && "pointer-events-none"} ${
                useQR ? "bg-teal-500" : "bg-gray-200"
              } focus:outline-none relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
            >
              <span
                className={`${
                  useQR ? "translate-x-6" : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
          </div>
        </Switch.Group>
      </div>

      <h1 className="text-lg font-semibold my-2">Empleados</h1>
      <div className="flex mb-3">
        <Input
          placeholder="Ingrese el correo del empleado"
          type="text"
          name="email"
          className="mr-2"
          icon={
            <AtSymbolIcon className="w-4 h-4 focus:outline-none focus:shadow-outline" />
          }
          disabled={loadingInviteEmployee}
        />
        <ButtonWithIcon
          text={`${loadingInviteEmployee ? "Invitando" : "Invitar"} empleado`}
          className="py-1 font-semibold text-sm min-w-max"
          textClassName="hidden sm:block"
          onClick={async () => {
            const emailInput = document.querySelector(
              `input[name="email"]`
            ) as HTMLInputElement;
            if (!emailInput || !emailInput.value.trim())
              return showModal({
                icon: "error",
                title: "No puedes dejar el correo del empleado a invitar vacío",
                buttons: "OK",
                submitButtonText: "Entendido",
              });

            const alreadyInLab = lab.employees.findIndex(
              ({ email }) => email === emailInput.value.trim()
            );
            if (alreadyInLab !== -1) {
              showModal({
                icon: "warning",
                body: `El empleado con correo "<b>${emailInput.value.trim()}</b>" ya forma parte de este laboratorio`,
                timer: 2200,
              });
              emailInput.value = "";
              setTimeout(() => emailInput.focus(), 0);
              return;
            }

            setLoadingInviteEmployee(true);
            const data = await inviteUser(
              {
                user: emailInput.value.trim(),
                labId: lab.id,
              },
              "INVITE"
            );
            // User already in app
            if (data.hasOwnProperty("id")) {
              setLabInfo((_labInfo) => {
                const _labs = [..._labInfo!];
                if (
                  !_labs[labIdx].employees.find(
                    (emp) => emp.id === (data! as UserType).id
                  )
                )
                  _labs[labIdx].employees.unshift(data as UserType);
                return _labs;
              });
            } else {
              if (data instanceof ResponseError) {
                if (data.key === "redundant") {
                  showModal({
                    icon: "warning",
                    body: `El empleado con correo "<b>${emailInput.value.trim()}</b>" ya forma parte de este laboratorio`,
                    timer: 2200,
                  });
                } else {
                  unexpectedError(data);
                }
              } else {
                showModal({
                  icon: "success",
                  body: `Se ha enviado una invitación al correo "<b>${emailInput.value.trim()}</b>"`,
                  timer: 2200,
                });
              }
            }
            emailInput.value = "";
            setTimeout(() => emailInput.focus(), 0);
            setLoadingInviteEmployee(false);
          }}
          disabled={loadingInviteEmployee}
        >
          {loadingInviteEmployee ? (
            <Spinner className="mr-1" />
          ) : (
            <UserAddIcon className="text-white h-5 w-5" />
          )}
        </ButtonWithIcon>
      </div>
      {!lab.employees.length ? (
        <p className="text-gray-700 flex items-center">
          El laboratorio no cuenta con ningún empleado aún.
        </p>
      ) : (
        auth &&
        lab.employees.map(
          (user, index) =>
            user.id !== auth["sub-user"] && (
              <EmployeeCard
                key={user.id}
                user={user}
                labId={lab.id}
                index={index}
                setLabInfo={setLabInfo}
              />
            )
        )
      )}
    </div>
  );
};

export default index;
