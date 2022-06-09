/* eslint-disable react-hooks/rules-of-hooks */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import { get, isTestAuthorized, put } from "../../../axios/Test";
import { create, get as getPatient } from "../../../axios/Patient";
import { get as getEmployee } from "../../../axios/User";
import { Test } from "../../../types/Prisma/Test";
import { Save, Spinner } from "../../../components/Icons";
import {
  DocumentDownloadIcon,
  DocumentReportIcon,
  DocumentTextIcon,
  XCircleIcon,
} from "@heroicons/react/outline";
import { Document, Preview } from "../../../components/PDF";
// @ts-ignore
import { usePDF } from "@react-pdf/renderer/lib/react-pdf.browser.cjs";
import { Auth } from "../../../types/Auth";
import Image from "next/image";
import { getTestItemName } from "../../../types/Test";
import { Modal, PatientModal, SearchList } from "../../../components";
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

  useEffect(() => {
    if (auth && test) {
      isTestAuthorized(test.id!).then((authorized) =>
        setIsAuthorized(authorized)
      );
    }
  }, [auth, test]);

  const [testPDF, _] = usePDF({
    document: test ? <Document test={test} /> : <></>,
  });

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
      <div className="text-center mt-8">
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
              <Image
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
                  setTesters([]); // just for forceRerender
                }}
                className="w-5 h-5 ml-3 fill-gray-500 hover:fill-teal-500 cursor-pointer"
              />
            </div>
          </div>
        ) : (
          <div className="my-2 text-center">
            {test.issuer.profileImg && (
              <div className="px-4 my-3 max-w-sm h-auto mx-auto">
                <Image
                  src={test.issuer.profileImg}
                  alt="profile_image_tester"
                  priority
                  width={300}
                  height={300}
                />
              </div>
            )}
            <p className="text-gray-800 font-bold">Información del tester</p>
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
                  setPatients([]); // just for forceRerender
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
        <div className="flex flex-col sm:flex-row justify-center text-center">
          <button
            className={`w-1/2 sm:w-auto mx-auto sm:mx-0 rounded-sm bg-red-500${
              !!(testPDF.loading || testPDF.error)
                ? ""
                : " hover:bg-red-700 hover:scale-105"
            } px-6 py-2 shadow-md my-2 transition duration-100 flex items-center text-white`}
            disabled={testPDF.loading || !!testPDF.error}
            onClick={() => {
              if (testPDF.loading || !!testPDF.error) return;
              const a = document.createElement("a");
              a.href = testPDF.url!;
              a.download = test.id!;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            }}
          >
            {testPDF.loading ? (
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
                {/* <a href={testPDF.url} target="_blank" rel="noreferrer">
                Preview
              </a> */}
                <DocumentDownloadIcon className="h-6 w-6 mr-2 text-white" />
                Download PDF
              </>
            )}
          </button>
          {/* <button className="w-1/2 sm:w-auto mx-auto sm:mx-4 rounded-sm bg-green-700 hover:bg-green-900 px-6 py-2 shadow-md my-2 hover:scale-105 transition duration-100 flex items-center text-white">
            <DocumentReportIcon className="h-6 w-6 mr-2 text-white" />
            Download Excel
          </button>
          <button className="w-1/2 sm:w-auto mx-auto sm:mx-0 rounded-sm bg-blue-500 hover:bg-blue-700 px-6 py-2 shadow-md my-2 hover:scale-105 transition duration-100 flex items-center text-white">
            <DocumentTextIcon className="h-6 w-6 mr-2 text-white" />
            Download Word
          </button> */}
        </div>
      </div>
      {/* <div className="flex justify-center mt-8">
        <Preview test={test} />
      </div> */}
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
