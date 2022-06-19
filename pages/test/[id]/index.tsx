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
  DocumentDownloadIcon,
  DocumentReportIcon,
  DocumentTextIcon,
  ExclamationCircleIcon,
  TrashIcon,
  XCircleIcon,
} from "@heroicons/react/outline";
import { Document, Preview } from "../../../components/PDF";
// @ts-ignore
import { usePDF } from "@react-pdf/renderer/lib/react-pdf.browser.cjs";
import { Auth } from "../../../types/Auth";
import NextImage from "next/image";
import { getTestItemName } from "../../../types/Test";
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

  const [labImgJpg, setLabImgJpg] = useState("");

  const [updatingRemarkLoading, setUpdatingRemarkLoading] = useState(false);
  const [deletingRemarkLoading, setDeletingRemarkLoading] = useState(false);

  const [sendingValidatorLoading, setSendingValidatorLoading] = useState(false);

  //#region TestPatient
  const [isPatientLoading, setPatientLoading] = useState(false);
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
    if (auth && test) {
      isTestAuthorized(test.id!).then((authorized) =>
        setIsAuthorized(authorized)
      );
    }
  }, [auth, test]);

  const [testPDF, updatePDF] = usePDF({
    document:
      test && test.lab && test.patient && labImgJpg ? (
        <Document test={test!} labImg={labImgJpg} />
      ) : (
        <></>
      ),
  });

  useEffect(() => {
    if (!test) return;
    if (labImgJpg) return updatePDF();
    const image = new Image();

    image.onload = function () {
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0);
      }
      //console.log("webptoJpg", canvas.toDataURL("image/jpeg"));
      // setLabImgJpg(canvas.toDataURL());
      // setLabImgJpg(canvas.toDataURL("image/png", 1));
      setLabImgJpg(canvas.toDataURL("image/jpeg", 1));
    };

    image.src = `/_next/image?url=${encodeURIComponent(
      test.lab!.img
    )}&w=750&q=75`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [test, labImgJpg, pdfState]);

  if (isAuthorized === undefined)
    return (
      <div className="min-w-full min-h-screen-navbar flex justify-center items-center -translate-y-16">
        <Spinner size="big" color="text-gray-300" />
      </div>
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
        Generating test...
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

  return (
    <>
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
            return alert(JSON.stringify(patient));
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
      <div className={`text-center my-8 ${!test.validator && "mb-16"}`}>
        <h1 className="text-xl text-gray-800">
          Test: <span className="font-bold">{test.id!}</span>
        </h1>
        <p className="text-gray-800">
          Fecha:{" "}
          <span className="font-bold">
            {new Date(test.date).toLocaleString()}
          </span>
        </p>
        {!test.lab ? (
          <p className="text-gray-800">
            Laboratorio: <span className="font-bold">Ninguno</span>
          </p>
        ) : (
          <div className="my-2 text-center">
            <div className="px-4 my-3 max-w-sm h-auto mx-auto">
              <NextImage
                src={test.lab.img}
                alt="image_lab"
                priority
                width={700}
                height={200}
              />
            </div>
            <p className="text-gray-800 font-bold">
              Información del laboratorio
            </p>
            <p>{test.lab.name}</p>
            <p>{test.lab.address}</p>
            <p>{test.lab.publicEmail}</p>
            <p>{test.lab.publicPhone}</p>
            {test.lab.web && <p>{test.lab.web}</p>}
          </div>
        )}
        {!test.issuer ? (
          <div>
            <p className="text-gray-800">Tester:</p>
            <div className="flex w-full items-center mb-2">
              <SearchList
                list={testers}
                placeholder="Busca por algún identificador del empleado"
                className="z-3 w-full"
                onQueryChange={onChangeTesterQuery}
                loading={isTesterLoading}
                onChange={(_tester) =>
                  (saveTester.current = _tester.value.toString())
                }
              />
              <Save
                onClick={async () => {
                  if (!saveTester.current || saveTester.current === "-1")
                    return alert("Necesitas seleccionar un tester");
                  const { status, testData } = await put(test.id!, {
                    issuerId: saveTester.current,
                  });
                  if (testData instanceof ResponseError)
                    return alert(JSON.stringify(testData));
                  test.issuer = testData!.issuer;
                  forceUpdate();
                  //setTesters([]); // just for forceRerender
                }}
                className="w-5 h-5 ml-3 fill-gray-500 hover:fill-teal-500 cursor-pointer"
              />
            </div>
          </div>
        ) : (
          <div className="my-2 text-center">
            <p className="text-gray-800 font-bold">Información del tester</p>
            {test.issuer.profileImg && (
              <div className="px-4 my-3 max-w-sm h-auto mx-auto">
                <NextImage
                  src={test.issuer.profileImg}
                  alt="profile_image_tester"
                  priority
                  width={300}
                  height={300}
                />
              </div>
            )}
            <p>{test.issuer.name}</p>
            <p>{test.issuer.email}</p>
            <p>{test.issuer.slug}</p>
          </div>
        )}
        {!test.patient ? (
          <div>
            <p className="text-gray-800">Paciente:</p>
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
              <Save
                onClick={async () => {
                  if (!savePatient.current || savePatient.current === "-1")
                    return alert("Necesitas seleccionar un paciente");
                  const { status, testData } = await put(test.id!, {
                    patientId: savePatient.current,
                  });
                  if (testData instanceof ResponseError)
                    return alert(JSON.stringify(testData));
                  test.patient = testData?.patient;
                  forceUpdate();
                  //setPatients([]); // just for forceRerender
                }}
                className="w-5 h-5 ml-3 fill-gray-500 hover:fill-teal-500 cursor-pointer"
              />
            </div>
          </div>
        ) : (
          <div className="my-2">
            <p className="text-gray-800 font-bold">Información del paciente</p>
            <p>{test.patient.name}</p>
            <p>{test.patient.dui}</p>
            <p>{test.patient.sex}</p>
            <p>{new Date(test.patient.dateBorn).toLocaleDateString()}</p>
            <p>{test.patient.phone}</p>
            <p>{test.patient.email}</p>
          </div>
        )}
        <p className="text-gray-800">
          Sexo según Chem: <span className="font-bold">{test.sex}</span>
        </p>
        <p className="text-lg font-bold text-gray-800">Tests:</p>
        {test.tests.map((item) => (
          <p key={item.name}>
            {getTestItemName(item.name).name} {item.assign} {item.value}
            {!item.range
              ? ""
              : `(${item.range.item}) ${item.range.between.from} - ${item.range.between.to}`}
          </p>
        ))}
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const formData = new FormData(form);
            const remarkInput = form.querySelector(
              `[name="remark"]`
            ) as HTMLInputElement;
            if (
              !formData.has("remark") ||
              !formData.get("remark")!.toString().trim()
            ) {
              alert(
                "Si quieres asignar una observación para este test, debes de escribir al menos una observación corta."
              );
              return remarkInput.focus();
            }
            setUpdatingRemarkLoading(true);
            const { status, testData } = await put(test.id!, {
              remark: {
                text: formData.get("remark")!.toString(),
                by: auth!.sub,
              },
            });
            setUpdatingRemarkLoading(false);
            if (testData instanceof ResponseError)
              return alert(JSON.stringify(testData));
            test.remark = testData?.remark;
            remarkInput.value = "";
            forceUpdate();
            remarkInput.focus();
          }}
          className="my-1 w-full text-center"
        >
          {test.remark && (
            <p className="font-bold text-gray-800 mb-1">
              Observaciones:{" "}
              <span className="font-normal">
                {test.remark.text}{" "}
                <span className="text-gray-400">
                  (Observación hecha por: {test.remark.by})
                </span>
              </span>
            </p>
          )}
          <div className="sm:flex items-center justify-center">
            <Input
              type="text"
              name="remark"
              placeholder={
                test.remark
                  ? "Sobreescriba la observación actual"
                  : "Escriba una observación para este test (opcional)"
              }
              multiline
              rows={3}
              className="max-w-xl mr-2"
              icon={<AnnotationIcon className="text-gray-400 h-5 w-5" />}
            />
            <div className="grid content-center">
              <ButtonWithIcon
                text={`${
                  updatingRemarkLoading ? "Guardando" : "Guardar"
                } observación`}
                className={`py-1 font-semibold w-full sm:w-auto`}
                disabled={deletingRemarkLoading || updatingRemarkLoading}
              >
                {updatingRemarkLoading ? (
                  <Spinner className="mr-1" />
                ) : (
                  <Save className="w-5 h-5 fill-white" />
                )}
              </ButtonWithIcon>
              {test.remark && (
                <ButtonWithIcon
                  onClick={async (e) => {
                    e.preventDefault();
                    setDeletingRemarkLoading(true);
                    const { status, testData } = await put(test.id!, {
                      remark: null,
                    });
                    setDeletingRemarkLoading(false);
                    if (testData instanceof ResponseError)
                      return alert(JSON.stringify(testData));
                    test.remark = testData?.remark;
                    forceUpdate();
                  }}
                  text={`${
                    deletingRemarkLoading ? "Eliminando" : "Eliminar"
                  } observación para este test`}
                  className={`mt-1 py-1 bg-red-500 border-red-300 ${
                    deletingRemarkLoading || updatingRemarkLoading
                      ? ""
                      : "hover:bg-red-900 hover:border-red-500"
                  } font-semibold w-full sm:w-auto`}
                  disabled={deletingRemarkLoading || updatingRemarkLoading}
                >
                  {deletingRemarkLoading ? (
                    <Spinner className="mr-1" />
                  ) : (
                    <TrashIcon className="w-5 h-5 text-white" />
                  )}
                </ButtonWithIcon>
              )}
            </div>
          </div>
        </form>
        {test.validator ? (
          <div className="my-2 text-center">
            <p className="text-gray-800 font-bold">Validado por</p>
            {test.validator.profileImg && (
              <div className="px-4 my-3 max-w-sm h-auto mx-auto">
                <NextImage
                  src={test.validator.profileImg}
                  alt="profile_image_tester"
                  priority
                  width={300}
                  height={300}
                />
              </div>
            )}
            <p>{test.validator.name}</p>
            <p>{test.validator.email}</p>
            <p>{test.validator.slug}</p>
          </div>
        ) : (
          <div className="block sm:flex w-full items-center my-2">
            <SearchList
              list={validators}
              placeholder="Busca por algún identificador del empleado"
              className="z-3 w-full"
              onQueryChange={onChangeValidatorQuery}
              loading={isValidatorLoading}
              onChange={(_validator) =>
                (saveValidator.current = _validator.value.toString())
              }
            />
            {/* <Save
              onClick={async () => {
                if (!saveTester.current || saveTester.current === "-1")
                  return alert("Necesitas seleccionar un tester");
                const { status, testData } = await put(test.id!, {
                  issuerId: saveTester.current,
                });
                if (testData instanceof ResponseError)
                  return alert(JSON.stringify(testData));
                test.issuer = testData!.issuer;
                forceUpdate();
                //setTesters([]); // just for forceRerender
              }}
              className="w-5 h-5 ml-3 fill-gray-500 hover:fill-teal-500 cursor-pointer"
            /> */}
            <ButtonWithIcon
              onClick={async (e) => {
                e.preventDefault();
                if (!saveValidator.current || saveValidator.current === "-1")
                  return alert("Necesitas seleccionar un validador");
                setSendingValidatorLoading(true);
                const testValidationResponse = await requestValidation(
                  test.id!,
                  saveValidator.current
                );
                setSendingValidatorLoading(false);
                if (testValidationResponse instanceof ResponseError)
                  return alert(JSON.stringify(testValidationResponse));
                alert("Se ha notificado al usuario correctamente");
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
        )}
        <div className="flex flex-col sm:flex-row justify-center text-center">
          {!test.patient ? (
            <p>
              <span className="text-red-500 font-bold mr-1">*</span>
              Necesitas definir el{" "}
              <span className="text-teal-500 font-semibold">paciente</span> para
              poder generar el pdf
            </p>
          ) : (
            <button
              className={`w-1/2 sm:w-auto mx-auto sm:mx-0 rounded-sm bg-red-500${
                !!(testPDF.loading || !labImgJpg || !test || testPDF.error)
                  ? ""
                  : " hover:bg-red-700 hover:scale-105"
              } px-6 py-2 shadow-md my-2 transition duration-100 flex items-center text-white`}
              disabled={
                testPDF.loading || !labImgJpg || !test || !!testPDF.error
              }
              onClick={() => {
                if (testPDF.loading || !labImgJpg || !test || !!testPDF.error)
                  return;
                const a = document.createElement("a");
                a.href = testPDF.url!;
                a.download = test.id!;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
              }}
            >
              {testPDF.loading || !labImgJpg || !test ? (
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
                  Download PDF
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
