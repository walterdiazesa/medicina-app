/* eslint-disable react-hooks/rules-of-hooks */
import {
  AdjustmentsIcon,
  AtSymbolIcon,
  BadgeCheckIcon,
  DocumentTextIcon,
  FingerPrintIcon,
  InformationCircleIcon,
  LocationMarkerIcon,
  OfficeBuildingIcon,
  PhoneIcon,
  UserAddIcon,
  UserGroupIcon,
} from "@heroicons/react/outline";
import React, { useEffect, useState } from "react";
import { ResponseError } from "../../../types/Responses";
import ButtonWithIcon from "../../Button/ButtonWithIcon";
import { EmployeeCard } from "../../Card";
import { Save, Spinner } from "../../Icons";
import { showModal } from "../../Modal/showModal";
import { patchUsers as inviteUser, updateLab } from "../../../axios/Lab";
import { Dialog, Switch } from "@headlessui/react";
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
import { Modal } from "../..";
import { isValidEmail } from "../../../utils/Email";

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

  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);

  const LabItems = () => (
    <>
      <div className="sm:w-1/2 lg:w-auto rounded-md shadow-xl px-4 sm:px-6 py-2 sm:py-4 my-3 sm:my-0 lg:mb-8 flex flex-col justify-center lg:block sm:mr-2 lg:mx-0">
        <DocumentTextIcon
          strokeWidth={1.5}
          className="hidden lg:block w-9 h-9 text-gray-400 mx-auto mb-2"
        />
        <p className="flex items-center">
          <AtSymbolIcon className="w-4 h-4 text-gray-600 font-normal translate-y-px" />
          :<span className="ml-1">{lab.publicEmail}</span>
        </p>
        <p className="flex items-center my-2 lg:my-0">
          <PhoneIcon className="w-4 h-4 text-gray-600 font-normal translate-y-px" />
          :<span className="ml-1">{lab.publicPhone}</span>
        </p>
        <p className="inline-flex align-baseline">
          <LocationMarkerIcon className="w-4 min-w-[1rem] h-4 text-gray-600 font-normal translate-y-1" />
          :<span className="ml-1 max-w-xs">{lab.address}</span>
        </p>
      </div>
      <div className="sm:w-1/2 lg:w-auto rounded-md shadow-xl px-4 sm:px-6 py-2 sm:py-4 flex flex-col justify-center lg:block sm:ml-2 lg:mx-0">
        <AdjustmentsIcon
          strokeWidth={1.5}
          className="hidden lg:block w-9 h-9 text-gray-400 mx-auto mb-2"
        />
        <div className="flex items-center">
          <p className="font-semibold mr-2">Usar código QR:</p>
          <Switch.Group as="div" className="flex items-center">
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
          </Switch.Group>
        </div>
        <div className="mt-2 lg:my-3">
          <p className="font-semibold">Tipo de ID para los exámenes:</p>
          <Switch.Group as="div" className="flex items-center">
            <Switch.Label
              passive
              className={`mr-3.5 ${
                useCustomTestId
                  ? "text-gray-500 font-medium"
                  : "text-gray-700 font-semibold"
              } text-sm flex`}
            >
              <span className="hidden 2xl:block">Por defecto &#40;</span>
              62902398718cd67f60f86ef2
              <span className="hidden 2xl:block">&#41;</span>
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
              <span className="hidden 2xl:block">Personalizada &#40;</span>
              {normalizeTestCustomId(
                1,
                lab.preferences.leadingZerosWhenCustomId!
              )}
              <span className="hidden 2xl:block">&#41;</span>
            </Switch.Label>
          </Switch.Group>
        </div>
        <Transition
          key={String(lab.preferences.useTestCustomId)}
          isOpen={useCustomTestId}
        >
          <div className="my-2">
            <p className="font-semibold mb-1">
              Cantidad de ceros antes de la parte entera:
            </p>
            <Dropdown
              className={`z-1 w-full max-w-[18rem] ${
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
        <div className="mb-2">
          <p className="font-semibold mr-2">ID del siguiente exámen:</p>
          <form
            className="flex items-center"
            onSubmit={async (e) => {
              e.preventDefault();
              const customIdStartFromInput = new FormData(
                e.target as HTMLFormElement
              ).get("customIdStartFrom");
              if (!customIdStartFromInput) return;
              if (
                !customIdStartFromInput.toString().trim() ||
                +customIdStartFromInput.toString() !==
                  +customIdStartFromInput.toString() ||
                !Number.isInteger(+customIdStartFromInput.toString()) ||
                parseInt(customIdStartFromInput.toString()) < 0
              )
                return showModal({
                  icon: "error",
                  title: !customIdStartFromInput.toString()
                    ? "No puedes dejar el número para iniciar el conteo de exámenes vacío"
                    : "Debes de digitar un número entero positivo (incluyendo el 0)",
                  buttons: "OK",
                  submitButtonText: "Entendido",
                });

              setUpdatingLabPreferences(true);
              const labRequest = await updateLab(lab.id, {
                preferences: {
                  ...lab.preferences,
                  customIdStartFrom: parseInt(
                    customIdStartFromInput.toString()
                  ),
                },
              });
              setUpdatingLabPreferences(false);
              if (labRequest instanceof ResponseError)
                return unexpectedError(labRequest);
              setLabInfo((_labInfo) => {
                const newLabInfo = [..._labInfo!];
                newLabInfo[labIdx].preferences.customIdStartFrom = parseInt(
                  customIdStartFromInput.toString()
                );
                return newLabInfo;
              });
              showModal({
                icon: "success",
                body: `El próximo exámen tendrá la ID "<b>${normalizeTestCustomId(
                  lab.preferences.customIdStartFrom!,
                  lab.preferences.leadingZerosWhenCustomId!
                )}</b>", después de ese examen se contará en correlativo desde el número "<b>${
                  lab.preferences.customIdStartFrom
                }</b>"`,
                buttons: "OK",
              });
            }}
          >
            <Input
              type="text"
              name="customIdStartFrom"
              defaultValue={
                lab.preferences.customIdStartFrom
                  ? lab.preferences.customIdStartFrom.toString()
                  : ""
              }
              placeholder=""
              className="mr-2 max-w-fit"
              onChange={(e) => {
                const typedKey = (e.nativeEvent as InputEvent).data || "";
                if (+typedKey !== +typedKey)
                  e.target.value = e.target.value.slice(0, -1);
              }}
            />
            <ButtonWithIcon text="" textClassName="ml-0" className="py-1">
              <Save className="h-5 w-5 fill-white" />
            </ButtonWithIcon>
          </form>
        </div>
      </div>
    </>
  );

  return (
    <div key={lab.id}>
      <Modal
        fullscreen
        open={isEmployeeModalOpen}
        setOpen={setIsEmployeeModalOpen}
        buttons={{
          submit: { text: "Cerrar", theme: "gray" },
        }}
        initialFocus="email"
      >
        <div className="bg-white pt-6 px-4 sm:px-6 pb-3 rounded-t-lg">
          <div className="text-center sm:text-left">
            <Dialog.Title
              as="h3"
              className="text-lg leading-6 font-medium text-gray-900 sm:flex items-center block"
            >
              <UserGroupIcon
                className="h-7 w-7 text-gray-500 inline-block sm:block mr-1.5"
                aria-hidden="true"
              />
              Administrar empleados para <b className="sm:ml-1">{lab.name}</b>
            </Dialog.Title>
            <div className="mt-2">
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
                  text={`${
                    loadingInviteEmployee ? "Invitando" : "Invitar"
                  } empleado`}
                  className="py-1 font-semibold text-sm min-w-max"
                  textClassName="hidden sm:block"
                  onClick={async (e) => {
                    e.preventDefault();
                    const emailInput = document.querySelector(
                      `input[name="email"]`
                    ) as HTMLInputElement;
                    if (!emailInput || !emailInput.value.trim()) {
                      showModal({
                        icon: "error",
                        title:
                          "No puedes dejar el correo del empleado a invitar vacío",
                        buttons: "OK",
                        submitButtonText: "Entendido",
                      });
                      if (emailInput) setTimeout(() => emailInput.focus(), 0);
                      return;
                    }

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

                    if (!isValidEmail(emailInput.value.trim())) {
                      showModal({
                        icon: "error",
                        title: "El correo proporcionado no es válido",
                        buttons: "OK",
                        submitButtonText: "Entendido",
                      });
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
                <div className="overflow-y-auto max-h-[50vh]">
                  {lab.employees.map(
                    (user, index) =>
                      user.id !== auth!["sub-user"] && (
                        <EmployeeCard
                          key={user.id}
                          user={user}
                          labId={lab.id}
                          index={index}
                          setLabInfo={setLabInfo}
                        />
                      )
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal>
      <h1 className="font-bold text-2xl">{lab.name}</h1>
      <div className="lg:flex">
        <div>
          {lab.img && (
            <div className="sm:my-2 max-h-44 h-44 relative">
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
            label={`${lab.img ? "Actualiza la" : "Sube una"} imagen ${
              lab.img ? "de" : "para"
            } ${labInfo.length === 1 ? "tu" : "este"} laboratorio`}
            className="my-1"
            iconWhenAttached={
              <OfficeBuildingIcon className="w-5 h-5 text-gray-400 group-hover:text-gray-600 animate-pulse" />
            }
            fieldSize="mini"
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
          <div className="block sm:flex lg:hidden">
            <LabItems />
          </div>
          {(!lab.signature || !lab.stamp) && (
            <p className="flex text-teal-500 items-center mt-4 mb-1">
              <InformationCircleIcon className="min-w-[1.25rem] h-5 w-5 mr-1" />
              te aconsejamos subir tu{" "}
              {!lab.signature && !lab.stamp
                ? "firma y sello"
                : !lab.signature
                ? "firma"
                : "sello"}{" "}
              como un comprobante para tus pacientes, además de ahorrar en
              gastos de tinta, escanéos, impresión y papeles.
            </p>
          )}
          <div className="mb-4 flex align-baseline">
            <div className="w-[calc(50%-0.25rem)] sm:w-1/2 mr-1 sm:mr-2">
              {lab.signature && (
                <>
                  <p className="mt-2 text-sm sm:text-base">Firma:</p>
                  <div className="my-2 w-full sm:w-[200px] h-[100px] relative flex items-center">
                    <Image
                      src={lab.signature}
                      alt="lab_signature"
                      width={200}
                      height={100}
                      objectFit="fill"
                      priority
                      quality={100}
                    />
                  </div>
                </>
              )}
              <Attachment
                key={lab.signature}
                label={`${lab.signature ? "Actualiza" : "Sube"} tu firma`}
                fieldSize="mini"
                iconWhenAttached={
                  <FingerPrintIcon className="w-5 h-5 text-gray-400 group-hover:text-gray-600 animate-pulse" />
                }
                {...(!lab.signature && {
                  labelClassName: "font-semibold text-teal-contrast",
                  fieldSize: "normal",
                  iconWhenAttached: (
                    <FingerPrintIcon className="w-8 h-8 text-gray-400 group-hover:text-gray-600 animate-pulse" />
                  ),
                })}
                className="my-1"
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
            <div className="w-[calc(50%-0.25rem)] sm:w-1/2 ml-1 sm:ml-2">
              {lab.stamp && (
                <>
                  <p className="mt-2 text-sm sm:text-base">Sello:</p>
                  <div className="my-2 w-full sm:w-[240px] h-[100px] relative flex items-center">
                    <Image
                      src={lab.stamp}
                      alt="lab_stamp"
                      width={240}
                      height={100}
                      objectFit="fill"
                      priority
                      quality={100}
                    />
                  </div>
                </>
              )}
              <Attachment
                key={lab.stamp}
                label={`${lab.stamp ? "Actualiza" : "Sube"} tu sello`}
                iconWhenAttached={
                  <FingerPrintIcon className="w-5 h-5 text-gray-400 group-hover:text-gray-600 animate-pulse" />
                }
                fieldSize="mini"
                {...(!lab.stamp && {
                  labelClassName: "font-semibold text-teal-contrast",
                  iconWhenAttached: (
                    <FingerPrintIcon className="w-8 h-8 text-gray-400 group-hover:text-gray-600 animate-pulse" />
                  ),
                  fieldSize: "normal",
                })}
                className="my-1"
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
          </div>
          <div
            onClick={() => setIsEmployeeModalOpen(true)}
            className="my-4 bg-teal-500 rounded-md shadow-xl px-6 py-4 cursor-pointer sm:hover:scale-105 transition-transform"
          >
            <UserGroupIcon
              className="mx-auto h-9 w-9 text-teal-contrast"
              strokeWidth={1.5}
            />
            <p className="text-white font-semibold text-center">
              Administrar Empleados
            </p>
          </div>
        </div>
        <div className="hidden lg:block lg:min-w-[360px] lg:ml-4 xl:ml-16">
          <LabItems />
        </div>
      </div>
    </div>
  );
};

export default index;
