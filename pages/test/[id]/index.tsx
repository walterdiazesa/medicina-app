/* eslint-disable react-hooks/rules-of-hooks */
import React from "react";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import { get } from "../../../axios/Test";
import { Test } from "../../../types/Test";
import { Spinner } from "../../../components/Icons";
import {
  DocumentDownloadIcon,
  DocumentReportIcon,
  DocumentTextIcon,
  XCircleIcon,
} from "@heroicons/react/outline";

const index = ({ test }: { test: Test | null }) => {
  const router = useRouter();

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

  return (
    <div className="text-center mt-8">
      <h1 className="text-xl text-gray-800">
        Test: <span className="font-bold">{test.id!}</span>
      </h1>
      <p className="text-lg text-gray-800">
        Fecha: <span className="font-bold">{test.date.toString()}</span>
      </p>
      <p className="text-lg text-gray-800">
        Laboratorio: <span className="font-bold">{test.labId || "No lab"}</span>
      </p>
      <p className="text-lg text-gray-800">
        Paciente:{" "}
        <span className="font-bold">{test.patientId || "No patient"}</span>
      </p>
      <p className="text-lg text-gray-800">
        Sexo: <span className="font-bold">{test.sex}</span>
      </p>
      <p className="text-lg font-bold text-gray-800">Tests:</p>
      {test.tests.map((item) => (
        <p key={item.name}>
          {item.name} {item.assign} {item.value}
          {!item.range
            ? ""
            : `(${item.range.item}) ${item.range.between.from} - ${item.range.between.to}`}
        </p>
      ))}
      <div className="flex flex-col sm:flex-row justify-center text-center">
        <button className="w-1/2 sm:w-auto mx-auto sm:mx-0 rounded-sm bg-red-500 hover:bg-red-700 px-6 py-2 shadow-md my-2 hover:scale-105 transition duration-100 flex items-center text-white">
          <DocumentDownloadIcon className="h-6 w-6 mr-2 text-white" />
          Download PDF
        </button>
        <button className="w-1/2 sm:w-auto mx-auto sm:mx-4 rounded-sm bg-green-700 hover:bg-green-900 px-6 py-2 shadow-md my-2 hover:scale-105 transition duration-100 flex items-center text-white">
          <DocumentReportIcon className="h-6 w-6 mr-2 text-white" />
          Download Excel
        </button>
        <button className="w-1/2 sm:w-auto mx-auto sm:mx-0 rounded-sm bg-blue-500 hover:bg-blue-700 px-6 py-2 shadow-md my-2 hover:scale-105 transition duration-100 flex items-center text-white">
          <DocumentTextIcon className="h-6 w-6 mr-2 text-white" />
          Download Word
        </button>
      </div>
    </div>
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
