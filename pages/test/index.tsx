/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from "react";
import { get } from "../../axios/Test";
import { Spinner } from "../../components/Icons";
import { Test } from "../../types/Test";
import {
  DocumentDownloadIcon,
  DocumentReportIcon,
  DocumentTextIcon,
  IdentificationIcon,
  OfficeBuildingIcon,
  UserIcon,
  XCircleIcon,
} from "@heroicons/react/outline";
import Link from "next/link";
import { listen, socket } from "../../socketio";

interface RealTimeTest extends Test {
  justInTime?: boolean;
}

const index = () => {
  const [, updateState] = React.useState<any>();
  const forceUpdate = React.useCallback(() => updateState({}), []);
  const [tests, setTests] = useState<RealTimeTest[] | null>();

  useEffect(() => {
    get({ order: "desc" }).then((_tests) => setTests(_tests));
  }, []);

  useEffect(() => {
    listen("test_created", (args: Test[]) => {
      if (tests) {
        setTests((_tests) => {
          if (!_tests!.some((test) => test.id === args[0].id))
            _tests!.unshift({ ...args[0], justInTime: true });
          return _tests;
        });
        forceUpdate();
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tests]);

  if (tests === undefined)
    return (
      <h1 className="mt-8 text-xl font-semibold text-gray-400 animate-pulse flex items-center justify-center min-w-full">
        <Spinner pulse color="text-gray-400" />
        Loading tests
      </h1>
    );

  if (tests === null)
    return (
      <h1 className="mt-8 text-xl font-semibold text-red-400 flex items-center justify-center min-w-full">
        <XCircleIcon className="h-6 w-6 mr-2" />
        Ocurrió un error al cargar los tests
      </h1>
    );

  return (
    <div className="min-w-full px-2 md:px-8">
      {tests.map((test) => (
        <Link key={test.id!} href={`/test/${test.id!}`}>
          <>
            {test.justInTime && (
              <span className="animate-ping absolute inline-flex h-1.5 w-1.5 rounded-full bg-teal-500 opacity-75 mt-1 ml-0.5" />
            )}
            <div className="rounded-sm bg-zinc-50 hover:bg-zinc-100 px-2 py-2 shadow-md my-4 flex items-center justify-between cursor-pointer">
              <div className="flex items-center">
                <div className="h-full w-5 mr-2">
                  <UserIcon
                    className={`h-5 w-5 ${
                      test.sex === "Femenino"
                        ? "text-pink-400"
                        : test.sex === "Masculino"
                        ? "text-sky-600"
                        : "text-gray-700"
                    }`}
                  />
                </div>
                <p className="text-gray-500 font-semibold w-32 sm:w-36 text-sm sm:text-base">
                  {new Date(test.date).toLocaleString()}
                </p>
                <p
                  className={`${
                    test.labId ? "text-gray-500" : "text-gray-400"
                  } font-semibold flex items-center md:w-36 mr-2.5 md:mr-0`}
                >
                  <OfficeBuildingIcon
                    className={`h-5 w-5 ${
                      !test.patientId ? "text-zinc-400" : "text-zinc-500"
                    } md:text-zinc-400`}
                  />
                  <span className="hidden md:block">
                    : {test.labId || "No lab"}
                  </span>
                </p>
                <p
                  className={`${
                    test.patientId ? "text-gray-500" : "text-gray-400"
                  } font-semibold flex items-center md:w-36 mr-2 md:mr-0`}
                >
                  <IdentificationIcon
                    className={`h-5 w-5 ${
                      !test.patientId ? "text-zinc-400" : "text-zinc-500"
                    } md:text-zinc-400`}
                  />
                  <span className="hidden md:block">
                    : {test.patientId || "No patient"}
                  </span>
                </p>
              </div>
              <div className="flex items-center truncate">
                <DocumentDownloadIcon className="h-5 w-5 mr-2 text-red-500 hover:text-red-900" />
                <DocumentReportIcon className="h-5 w-5 mr-2 text-green-700 hover:text-green-900" />
                <DocumentTextIcon className="h-5 w-5 mr-2 text-blue-500 hover:text-blue-700" />
                <p
                  className={`text-gray-500 font-semibold text-sm sm:text-base hidden sm:block`}
                >
                  [
                  {(
                    JSON.parse(JSON.stringify(test.tests, ["name"])) as {
                      name: string;
                    }[]
                  ).map(({ name }, idx) => (idx ? ", " : "") + name)}
                  ]{/* [{"name":"GLU-PS"},{"name":"TCHO-PS"}] */}
                </p>
              </div>
            </div>
          </>
        </Link>
      ))}
    </div>
  );
};

export default React.memo(index);
