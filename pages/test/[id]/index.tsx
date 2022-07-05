/* eslint-disable react-hooks/rules-of-hooks */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import {
  get,
  isTestAuthorized,
  put,
  requestValidation,
} from "../../../axios/Test";
import { create, get as getPatient } from "../../../axios/Patient";
import { get as getEmployee } from "../../../axios/User";
import { Test } from "../../../types/Prisma/Test";
import { Save, Spinner } from "../../../components/Icons";
import {
  AnnotationIcon,
  BadgeCheckIcon,
  CakeIcon,
  DocumentDownloadIcon,
  DocumentReportIcon,
  DocumentTextIcon,
  ExclamationCircleIcon,
  IdentificationIcon,
  MailIcon,
  PaperAirplaneIcon,
  PencilIcon,
  PhoneIcon,
  QrcodeIcon,
  TrashIcon,
  UserIcon,
  XCircleIcon,
} from "@heroicons/react/outline";
import { Document, Preview } from "../../../components/PDF";
import {
  usePDF,
  PDFViewer,
  // @ts-ignore
} from "@react-pdf/renderer/lib/react-pdf.browser.cjs";
import { Auth } from "../../../types/Auth";
import NextImage from "next/image";
import { getTestId, getTestItemName } from "../../../types/Test";
import {
  ButtonWithIcon,
  Input,
  Modal,
  PatientModal,
  SearchList,
} from "../../../components";
import { debounce } from "../../../utils";
import { ResponseError } from "../../../types/Responses";
import { Patient } from "../../../types/Prisma";
import { Dialog } from "@headlessui/react";
import { showModal } from "../../../components/Modal/showModal";
import { getLaboratory } from "../../../axios/Lab";
import { Document as RenderDocument, Page as RenderPage } from "react-pdf";

type SearchListItem = {
  value: number | string;
  text: string;
  disabled?: boolean | null;
};

const index = ({ test, auth }: { test: Test | null; auth: Auth }) => {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean>();
  const [pdfState, updateState] = React.useState<number>();
  const forceUpdate = React.useCallback(() => updateState(Math.random()), []);

  const [updatingRemarkLoading, setUpdatingRemarkLoading] = useState(false);
  const [isRemarkModalOpen, setRemarkModalOpen] = useState(false);
  const [deletingRemarkLoading, setDeletingRemarkLoading] = useState(false);

  const [isValidating, setValidating] = useState(false);
  const [sendingValidatorLoading, setSendingValidatorLoading] = useState(false);

  //#region TestPatient
  const [isPatientLoading, setPatientLoading] = useState(false);
  const [isPatientSavingLoading, setPatientSavingLoading] = useState(false);
  const [patients, setPatients] = useState<SearchListItem[]>([]);
  const savePatient = useRef("");
  const [isCreatePatientOpen, setIsCreatePatientOpen] = useState(false);
  const newPatientQuery = useRef("");
  const createdNewPatient = useRef<SearchListItem>({ value: -1, text: "" });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updatePatientQuery = useCallback(
    debounce((query: string) => {
      if (!query) return setPatients([]), setPatientLoading(false);
      getPatient(query).then((AppPatient) => {
        if (!AppPatient) return setPatients([]), setPatientLoading(false);
        const _patients: typeof patients = [];
        for (const patient of AppPatient) {
          _patients.push({
            value: patient.id,
            text: `${patient.dui}, ${patient.name}, ${patient.sex}`,
          });
        }
        setPatients(_patients);
        setPatientLoading(false);
      });
    }, 1500),
    [test]
  );

  const onChangePatientQuery = (patientQuery: string) => {
    setPatientLoading(true);
    newPatientQuery.current = patientQuery;
    updatePatientQuery(patientQuery);
  };
  //#endregion

  //#region TestTester
  const [isTesterModalOpen, setTesterModalOpen] = useState(false);
  const [isTesterLoading, setTesterLoading] = useState(false);
  const [testers, setTesters] = useState<SearchListItem[]>([]);
  const saveTester = useRef("");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateTesterQuery = useCallback(
    debounce((query: string) => {
      if (!query || !test) return setTesters([]), setTesterLoading(false);
      getEmployee(test.labId!, query).then((AppEmployee) => {
        if (!AppEmployee) return setTesters([]), setTesterLoading(false);
        const _testers: typeof testers = [];
        for (const tester of AppEmployee) {
          _testers.push({
            value: tester.id,
            text: `${tester.slug}, ${tester.name}, ${tester.email}`,
          });
        }
        setTesters(_testers);
        setTesterLoading(false);
      });
    }, 1500),
    [test]
  );

  const onChangeTesterQuery = (testerQuery: string) => {
    setTesterLoading(true);
    updateTesterQuery(testerQuery);
  };
  //#endregion

  //#region TestValidator
  const [isValidatorModalOpen, setValidatorModalOpen] = useState(false);
  const [isValidatorLoading, setValidatorLoading] = useState(false);
  const [validators, setValidators] = useState<SearchListItem[]>([]);
  const saveValidator = useRef("");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateValidatorQuery = useCallback(
    debounce((query: string) => {
      if (!query || !test) return setValidators([]), setValidatorLoading(false);
      getEmployee(test.labId!, query).then((AppEmployee) => {
        if (!AppEmployee) return setValidators([]), setValidatorLoading(false);
        const _validators: typeof validators = [];
        for (const validator of AppEmployee) {
          _validators.push({
            value: validator.id,
            text: `${validator.slug}, ${validator.name}, ${validator.email}`,
          });
        }
        setValidators(_validators);
        setValidatorLoading(false);
      });
    }, 1500),
    [test]
  );

  const onChangeValidatorQuery = (validatorQuery: string) => {
    setValidatorLoading(true);
    updateValidatorQuery(validatorQuery);
  };
  //#endregion

  useEffect(() => {
    if (
      Object.keys(router.query).length &&
      (auth || router.query.access) &&
      test
    ) {
      getLaboratory({
        id: test.lab!.id,
        fields: { img: true, preferences: true },
        ...(router.query.access && {
          access: router.query.access as string,
          test: test.id!,
        }),
      }).then((labData) => {
        if (labData)
          test.lab = {
            ...test.lab!,
            preferences: { ...test.lab!.preferences, ...labData.preferences },
          };
        setIsAuthorized(!!labData);
      });
    }
  }, [auth, test, router]);

  const [testPDF, updatePDF] = usePDF({
    document:
      test && test.lab && test.patient ? <Document test={test!} /> : <></>,
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => test && updatePDF(), [test, pdfState, router]);

  if (isAuthorized === undefined)
    return (
      <div className="min-w-full min-h-screen-navbar flex justify-center items-center -translate-y-16">
        <Spinner size="big" color="text-gray-300" />
      </div>
    );

  if (!isAuthorized && router.query.access)
    return (
      <h1 className="mt-8 text-xl font-semibold text-red-400 flex items-center justify-center min-w-full">
        <QrcodeIcon className="h-6 w-6 mr-2" />
        Código de acceso no válido.
      </h1>
    );

  if (!isAuthorized)
    return (
      <h1 className="mt-8 text-xl font-semibold text-red-400 flex items-center justify-center min-w-full">
        <XCircleIcon className="h-6 w-6 mr-2" />
        No estas autorizado para ver este test.
      </h1>
    );

  if (router.isFallback)
    return (
      <h1 className="mt-8 text-xl font-semibold text-gray-400 animate-pulse flex items-center justify-center min-w-full">
        <Spinner pulse color="text-gray-400" />
        Generando test...
      </h1>
    );

  if (!test)
    return (
      <h1 className="mt-8 text-xl font-semibold text-red-400 flex items-center justify-center min-w-full">
        <XCircleIcon className="h-6 w-6 mr-2" />
        Ocurrió un error al generar el test solicitado.
      </h1>
    );

  // const [testPDF, _] = useState({ loading: false, error: "", url: "/" });

  if (router.query.access && testPDF.loading)
    return (
      <h1 className="mt-8 text-xl font-semibold text-gray-400 animate-pulse flex items-center justify-center min-w-full">
        <Spinner pulse color="text-gray-400" />
        Generando test...
      </h1>
    );

  if (router.query.access && testPDF.url) {
    return (
      <embed
        src={testPDF.url}
        className="inset-0 w-screen h-screen absolute z-50"
      />
    );
  }

  return (
    <>
      <Modal
        open={isRemarkModalOpen}
        setOpen={setRemarkModalOpen}
        buttons={{
          submit: {
            text: `${test.remark ? "Sobreescribir" : "Guardar"} observación`,
            theme: "teal",
          },
          cancel: { text: "Cancelar" },
        }}
        disableCloseWhenTouchOutside
        submitCallback={async ({ remark }: { remark: string }) => {
          setUpdatingRemarkLoading(true);
          const { status, testData } = await put(test.id!, {
            remark: {
              text: remark,
              by: auth!.sub,
            },
          });
          setUpdatingRemarkLoading(false);
          if (testData instanceof ResponseError)
            return showModal({
              icon: "error",
              body: JSON.stringify(testData),
              buttons: "OK",
              submitButtonText: "Entendido",
            }); // TODO: Show real message
          test.remark = testData?.remark;
          forceUpdate();
        }}
        requiredItems={new Set(["remark"])}
        initialFocus="remark"
      >
        <div className="bg-white pt-3 px-4 sm:px-6 rounded-t-lg">
          <div className="text-center sm:text-left">
            <div className="mt-2">
              {test.remark && (
                <p className="font-bold text-gray-800 mb-2">
                  Observación actual:
                  <span className="ml-1 font-normal">
                    {test.remark.text}{" "}
                    <span className="text-gray-400">
                      (Observación hecha por: {test.remark.by})
                    </span>
                  </span>
                </p>
              )}
              <Input
                type="text"
                name="remark"
                placeholder="Escriba una observación para este test"
                multiline
                rows={3}
                icon={<AnnotationIcon className="text-gray-400 h-5 w-5" />}
              />
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        open={isCreatePatientOpen}
        setOpen={setIsCreatePatientOpen}
        buttons={{
          submit: { text: "Agregar", theme: "teal" },
          cancel: { text: "Cancelar" },
        }}
        disableCloseWhenTouchOutside
        submitCallback={async (items: Patient) => {
          items["dateBorn"] = new Date(items["dateBorn"]);
          const patient = await create(items);
          if (patient instanceof ResponseError)
            return showModal({
              icon: "error",
              body: JSON.stringify(patient),
              buttons: "OK",
              submitButtonText: "Entendido",
            }); // TODO: Show real message
          const selectedNewPatient = {
            value: patient.id,
            text: `${patient.dui}, ${patient.name}, ${patient.sex}`,
          };
          setPatients((_patients) => {
            const patientsList = [selectedNewPatient, ..._patients];
            return patientsList;
          });
          createdNewPatient.current = selectedNewPatient;
        }}
        requiredItems={
          new Set(["name", "dui", "sex", "email", "phone", "dateBorn"])
        }
        /* initialFocus="submit" */
      >
        <PatientModal type="create" fromQuery={newPatientQuery.current} />
      </Modal>
      <Modal
        open={isTesterModalOpen}
        setOpen={setTesterModalOpen}
        buttons={{
          submit: { text: "Guardar tester", theme: "teal" },
          cancel: { text: "Cancelar" },
        }}
        disableCloseWhenTouchOutside
        submitCallback={async () => {
          if (!saveTester.current || saveTester.current === "-1")
            return showModal({
              icon: "error",
              title: "Necesitas seleccionar un tester",
              buttons: "OK",
              submitButtonText: "Entendido",
            });
          const { status, testData } = await put(test.id!, {
            issuerId: saveTester.current,
          });
          if (testData instanceof ResponseError)
            return showModal({
              icon: "error",
              body: JSON.stringify(testData),
              buttons: "OK",
              submitButtonText: "Entendido",
            }); // TODO: Show real message
          test.issuer = testData!.issuer;
          forceUpdate();
        }}
        requiredItems={new Set(["tester"])}
        initialFocus="tester"
      >
        <div className="bg-white pt-6 px-4 sm:px-6 pb-3 rounded-t-lg">
          <div className="text-center sm:text-left">
            <Dialog.Title
              as="h3"
              className="text-lg leading-6 font-medium text-gray-900 sm:flex items-center block"
            >
              <UserIcon
                className="h-7 w-7 text-gray-500 inline-block sm:block mr-1.5"
                aria-hidden="true"
              />
              ¿Quién fue la persona que creó este test?
            </Dialog.Title>
            <div className="mt-2">
              <SearchList
                name="tester"
                list={testers}
                placeholder="Busca por algún identificador del empleado"
                className="z-3 w-full"
                onQueryChange={onChangeTesterQuery}
                loading={isTesterLoading}
                onChange={(_tester) =>
                  (saveTester.current = _tester.value.toString())
                }
              />
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        open={isValidatorModalOpen}
        setOpen={setValidatorModalOpen}
        buttons={{
          submit: { text: "Cerrar y volver al test" },
        }}
        initialFocus="validator"
      >
        <div className="bg-white pt-6 px-4 sm:px-6 pb-3 rounded-t-lg">
          <div className="text-center sm:text-left">
            <Dialog.Title
              as="h3"
              className="text-lg leading-6 font-medium text-gray-900 sm:flex items-center block"
            >
              <PaperAirplaneIcon
                className="h-7 w-7 text-gray-500 inline-block sm:block mr-1.5"
                aria-hidden="true"
              />
              Enviar solicitud para validación
            </Dialog.Title>
            <div className="mt-2">
              <p className="text-gray-400">
                1- Busca, encuentra y selecciona el empleado al que quieras
                hacer llegar la solicitud para validar el examen, esta llegará a
                su correo y lo notificará en la aplicación
              </p>
              <p className="text-gray-400">
                2- Puedes enviar tantas solicitudes a tantos empleados como
                desees, el primero en validar el test quedará guardado para este
                test
              </p>
              <p className="text-gray-400">
                3- Una vez el test haya sido validado, no se podrá deshacer esta
                acción
              </p>
              <div className="block sm:flex w-full items-center my-2">
                <SearchList
                  name="validator"
                  list={validators}
                  placeholder="Busca por algún identificador del empleado"
                  className="z-3 w-full"
                  onQueryChange={onChangeValidatorQuery}
                  loading={isValidatorLoading}
                  onChange={(_validator) =>
                    (saveValidator.current = _validator.value.toString())
                  }
                />
                <ButtonWithIcon
                  onClick={async (e) => {
                    e.preventDefault();
                    if (
                      !saveValidator.current ||
                      saveValidator.current === "-1"
                    )
                      return showModal({
                        icon: "error",
                        title: "Necesitas seleccionar un validador",
                        buttons: "OK",
                        submitButtonText: "Entendido",
                      });
                    setSendingValidatorLoading(true);
                    const testValidationResponse = await requestValidation(
                      test.id!,
                      saveValidator.current
                    );
                    setSendingValidatorLoading(false);
                    if (testValidationResponse instanceof ResponseError)
                      return showModal({
                        icon: "error",
                        body: JSON.stringify(testValidationResponse),
                        buttons: "OK",
                        submitButtonText: "Entendido",
                      }); // TODO: Show real message
                    showModal({
                      icon: "success",
                      body: "Se ha notificado al usuario correctamente",
                      timer: 1500,
                    });
                    // setValidators([]);
                  }}
                  text={`${
                    sendingValidatorLoading ? "Enviando" : "Enviar"
                  } a validación`}
                  className={`mt-1 sm:mt-0 sm:ml-2 py-1 font-semibold min-w-max w-full sm:w-max`}
                  disabled={sendingValidatorLoading}
                >
                  {sendingValidatorLoading ? (
                    <Spinner className="mr-1" />
                  ) : (
                    <BadgeCheckIcon className="w-5 h-5 text-white" />
                  )}
                </ButtonWithIcon>
              </div>
              <p className="text-[#aeb2b7] text-sm">
                Cuando envíes las solicitudes necesarias puedes cerrar este
                modal y esperar hasta que el test haya sido aprobado (deberás
                recargar esta pestaña)
              </p>
            </div>
          </div>
        </div>
      </Modal>
      <div className={`max-w-6xl my-8 ${!test.validator && "mb-16"}`}>
        <h1 className="text-2xl sm:text-4xl font-mono text-gray-800 font-bold">
          {getTestId(test)}
          {auth!["sub-lab"].length > 1 && (
            <span className="ml-2 text-base font-normal text-gray-600 font-sans hidden sm:block">
              {new Date(test.date).format("DD/MM/YYYY HH:MM A")}
            </span>
          )}
        </h1>
        {auth!["sub-lab"].length > 1 ? (
          <>
            <p className="text-gray-800">
              Laboratorio:{" "}
              <span className="font-bold text-teal-500">
                {test.lab?.name || "Ninguno"}
              </span>
            </p>
            <p className="text-gray-800 sm:hidden">
              Creado el:{" "}
              <span className="font-bold">
                {new Date(test.date).format("DD/MM/YYYY HH:MM A")}
              </span>
            </p>
          </>
        ) : (
          <p className="text-gray-800">
            Creado el:{" "}
            <span className="font-bold">
              {new Date(test.date).format("DD/MM/YYYY HH:MM A")}
            </span>
          </p>
        )}
        {/* Test info */}
        <div className="my-4">
          {!test.patient ? (
            <div>
              <p className="text-gray-800 font-semibold">
                ¿Quién fue el paciente de este examen?
              </p>
              <div className="flex w-full items-center mb-2">
                <SearchList
                  list={patients}
                  placeholder="Busca por algún identificador del paciente"
                  className="z-3 w-full"
                  addCustom
                  onQueryChange={onChangePatientQuery}
                  loading={isPatientLoading}
                  onChange={(_patient) =>
                    (savePatient.current = _patient.value.toString())
                  }
                  newAdded={createdNewPatient.current}
                  onCreateClick={() => setIsCreatePatientOpen(true)}
                />
                {isPatientSavingLoading ? (
                  <Spinner color="text-gray-400" className="ml-3" />
                ) : (
                  <Save
                    onClick={async () => {
                      if (!savePatient.current || savePatient.current === "-1")
                        return showModal({
                          icon: "error",
                          title: "Necesitas seleccionar un paciente",
                          buttons: "OK",
                          submitButtonText: "Entendido",
                        });
                      setPatientSavingLoading(true);
                      const { status, testData } = await put(test.id!, {
                        patientId: savePatient.current,
                      });
                      setPatientSavingLoading(false);
                      if (testData instanceof ResponseError)
                        return showModal({
                          icon: "error",
                          body: JSON.stringify(testData),
                          buttons: "OK",
                          submitButtonText: "Entendido",
                        }); // TODO: Show real message
                      test.patient = testData?.patient;
                      forceUpdate();
                      //setPatients([]); // just for forceRerender
                    }}
                    className="w-5 h-5 ml-3 fill-gray-500 hover:fill-teal-500 cursor-pointer"
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-md shadow-lg bg-gradient-to-br from-[#e9e9e9] sm:from-[#f0f0f0] to-white px-4 py-2 mb-2">
              <p className="text-gray-800 font-bold">
                Información del paciente
              </p>
              <div className="sm:flex items-center">
                <p className="mr-4">{test.patient.name}</p>
                <p className="flex items-center mr-4">
                  <IdentificationIcon className="h-5 w-5 text-gray-600" />:{" "}
                  {test.patient.dui}
                </p>
                <p className="flex items-center mr-4">
                  <UserIcon className="h-5 w-5 text-gray-600" />:{" "}
                  {test.patient.sex}
                </p>
                <p className="flex items-center mr-4">
                  <CakeIcon className="h-5 w-5 text-gray-600" />:{" "}
                  {new Date(test.patient.dateBorn).toLocaleDateString()}
                </p>
                <p className="flex items-center mr-4">
                  <PhoneIcon className="h-5 w-5 text-gray-600" />:{" "}
                  {test.patient.phone}
                </p>
                <p className="flex items-center mr-4">
                  <MailIcon className="h-5 w-5 text-gray-600" />:{" "}
                  {test.patient.email}
                </p>
              </div>
            </div>
          )}
          <p className="text-gray-800">
            Sexo del paciente según el analizador:{" "}
            <span className="font-bold">{test.sex}</span>
          </p>
          <div className="rounded-md shadow-lg bg-gradient-to-br from-[#e9e9e9] sm:from-[#f0f0f0] to-white px-4 py-2 mb-2">
            <p className="font-bold text-gray-800">Tests:</p>
            <div
              className={`${test.tests.length > 4 && "sm:grid"} grid-cols-3`}
            >
              {test.tests.map((item) => (
                <p key={item.name}>
                  {getTestItemName(item.name).name} {item.assign} {item.value}
                  {!item.range
                    ? ""
                    : `(${item.range.item}) ${item.range.between.from} - ${item.range.between.to}`}
                </p>
              ))}
            </div>
          </div>
          <p className="font-bold text-gray-800 sm:flex items-center">
            Observaciones:
            {!test.remark ? (
              <span className="ml-1 font-normal">
                {updatingRemarkLoading ? (
                  <Spinner color="text-gray-500" className="ml-2" />
                ) : (
                  <>
                    Ninguna,
                    <span
                      onClick={() => setRemarkModalOpen(true)}
                      className="cursor-pointer font-semibold text-teal-500 hover:text-teal-300"
                    >
                      {" "}
                      Agregar una observación
                    </span>
                  </>
                )}
              </span>
            ) : (
              <>
                <span className="sm:flex items-center mx-1 font-normal">
                  {test.remark.text}{" "}
                  <span className="text-gray-400">
                    (Observación hecha por: {test.remark.by})
                  </span>
                  <span className="inline-flex translate-y-1 sm:translate-y-0">
                    {updatingRemarkLoading ? (
                      <Spinner color="text-gray-500" className="ml-2" />
                    ) : (
                      <PencilIcon
                        onClick={() => setRemarkModalOpen(true)}
                        className={`h-5 w-5 ml-2 text-gray-400 ${
                          deletingRemarkLoading || updatingRemarkLoading
                            ? ""
                            : "hover:text-gray-500 cursor-pointer"
                        }`}
                      />
                    )}
                    {deletingRemarkLoading ? (
                      <Spinner color="text-gray-500" className="ml-2" />
                    ) : (
                      <TrashIcon
                        onClick={async () => {
                          setDeletingRemarkLoading(true);
                          const { status, testData } = await put(test.id!, {
                            remark: null,
                          });
                          setDeletingRemarkLoading(false);
                          if (testData instanceof ResponseError)
                            return showModal({
                              icon: "error",
                              body: JSON.stringify(testData),
                              buttons: "OK",
                              submitButtonText: "Entendido",
                            }); // TODO: Show real message
                          test.remark = testData?.remark;
                          forceUpdate();
                        }}
                        className={`h-5 w-5 ml-2 text-gray-400 ${
                          updatingRemarkLoading
                            ? ""
                            : "hover:text-red-500 cursor-pointer"
                        }`}
                      />
                    )}
                  </span>
                </span>
              </>
            )}
          </p>
        </div>
        <p className="text-gray-800 font-bold">
          Test creado por:{" "}
          <span className="font-normal">
            {test.issuer ? (
              test.issuer.name
            ) : (
              <>
                {test.lab?.name || ""} o{" "}
                <span
                  onClick={() => setTesterModalOpen(true)}
                  className="cursor-pointer font-semibold text-teal-500 hover:text-teal-300"
                >
                  Un empleado de este laboratorio
                </span>
              </>
            )}
          </span>
        </p>
        <p className="text-gray-800 font-bold flex">
          Test validado por:
          <span className="ml-1 font-normal">
            {test.validator ? (
              test.validator.name
            ) : (
              <span className="flex items-center">
                Aún no validado,
                <span
                  onClick={() => setValidatorModalOpen(true)}
                  className="mx-1 cursor-pointer font-semibold text-teal-500 hover:text-teal-300"
                >
                  solicitar una validación
                </span>
                o
                {isValidating ? (
                  <Spinner color="text-gray-500" className="ml-2" />
                ) : (
                  <span
                    onClick={async () => {
                      setValidating(true);
                      const { status, testData } = await put(test.id!, {
                        validatorId: auth!["sub-user"],
                      });
                      setValidating(false);
                      if (testData instanceof ResponseError)
                        return showModal({
                          icon: "error",
                          body: JSON.stringify(testData),
                          buttons: "OK",
                          submitButtonText: "Entendido",
                        }); // TODO: Show real message
                      test.validator = testData!.validator;
                      test.validated = testData!.validated;
                      forceUpdate();
                    }}
                    className="ml-1 cursor-pointer font-semibold text-teal-500 hover:text-teal-300"
                  >
                    validar
                  </span>
                )}
              </span>
            )}
          </span>
        </p>
        <div className="mt-2 flex flex-col sm:flex-row justify-center text-center">
          {!test.patient ? (
            <p>
              <span className="text-red-500 font-bold mr-1">*</span>
              Necesitas definir el <span className="font-bold">
                paciente
              </span>{" "}
              para poder generar el pdf
            </p>
          ) : (
            <button
              className={`w-full sm:w-auto mx-auto sm:mx-0 rounded-sm bg-red-500${
                !!(testPDF.loading || !test || !!testPDF.error)
                  ? ""
                  : " hover:bg-red-700 hover:scale-105"
              } px-6 py-2 shadow-md my-2 transition duration-100 flex items-center justify-center text-white`}
              disabled={testPDF.loading || !test || !!testPDF.error}
              onClick={() => {
                if (testPDF.loading || !test || !!testPDF.error) return;
                const a = document.createElement("a");
                a.href = testPDF.url!;
                a.download = getTestId(test);
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
              }}
            >
              {testPDF.loading || !test ? (
                <div className="animate-pulse flex items-center">
                  <Spinner pulse /> Generando...
                </div>
              ) : testPDF.error ? (
                <>
                  <XCircleIcon className="h-6 w-6 mr-2" />
                  {testPDF.error.substring(0, 20)}
                </>
              ) : (
                <>
                  <DocumentDownloadIcon className="h-6 w-6 mr-2 text-white" />
                  Descargar Examen
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export const getStaticProps = async ({
  params,
}: {
  params: { id: string };
}) => {
  const test = await get(params.id);

  return {
    props: {
      test,
    },
  };
};

export async function getStaticPaths() {
  const tests = await get({ order: "desc" });

  const paths = !tests ? [] : tests.map(({ id }) => ({ params: { id } }));

  return {
    paths,
    fallback: true,
  };
}

export default index;
