/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { deleteTest, get, getAccessLink } from "../../axios/Test";
import { Spinner } from "../../components/Icons";
import { Test } from "../../types/Prisma/Test";
import {
  BadgeCheckIcon,
  DocumentDownloadIcon,
  DocumentReportIcon,
  DocumentTextIcon,
  IdentificationIcon,
  OfficeBuildingIcon,
  SearchIcon,
  TrashIcon,
  UserIcon,
  XCircleIcon,
} from "@heroicons/react/outline";
import Link from "next/link";
import { listen, socket } from "../../socketio";
import { useRouter } from "next/router";
import { ResponseError } from "../../types/Responses";
import { Input, Modal } from "../../components";
import { showModal } from "../../components/Modal/showModal";
import { getTestCategory, normalizeTestCustomId } from "../../types/Test";
import dynamic from "next/dynamic";
import { unexpectedError } from "../../utils/Error";

interface RealTimeTest extends Test {
  justInTime?: boolean;
}

const index = () => {
  const [, updateState] = React.useState<any>();
  const forceUpdate = React.useCallback(() => updateState({}), []);
  const [tests, setTests] = useState<RealTimeTest[] | null>();

  const [testQuery, setTestQuery] = useState("");
  const queryTests = useMemo(() => {
    return tests && testQuery
      ? tests.filter((test) => {
          if (test.id!.toLowerCase().includes(testQuery.toLowerCase()))
            return true;
          if (normalizeTestCustomId(test.customId).includes(testQuery.trim()))
            return true;
          if (
            test.patient &&
            (test
              .patient!.name.normalizeQuery()
              .includes(testQuery.normalizeQuery()) ||
              test
                .patient!.dui.normalizeQuery()
                .includes(testQuery.normalizeQuery()) ||
              test
                .patient!.email.normalizeQuery()
                .includes(testQuery.normalizeQuery()) ||
              test
                .patient!.phone.normalizeQuery()
                .includes(testQuery.normalizeQuery()))
          )
            return true;
        })
      : tests;
  }, [testQuery, tests]);

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
        Cargando tests
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
    <div>
      {!tests.length ? (
        <div className="min-h-screen-navbar min-w-full flex justify-center items-center -translate-y-16">
          <h1>
            Esto está muy vacío, empieza por hacer una petición en el CHEM
          </h1>
        </div>
      ) : (
        <div className="mt-8">
          <Input
            placeholder="Busca un examen por ID o algún identificador del paciente"
            type="text"
            autofocus
            name="search"
            icon={<SearchIcon className="w-5 h-5 text-gray-400" />}
            onChange={(e) => {
              const query = e.target.value;
              setTestQuery(query);
            }}
          />
          {queryTests &&
            queryTests.map((test) => (
              <Link key={test.id!} href={`/test/${test.id!}`}>
                <div>
                  {test.justInTime && (
                    <span className="animate-ping absolute inline-flex h-1.5 w-1.5 rounded-full bg-teal-500 opacity-75 mt-1 ml-0.5" />
                  )}
                  <div className="rounded-sm bg-zinc-50 hover:bg-zinc-100 px-2 py-2 shadow-md my-4 flex items-center justify-between cursor-pointer">
                    <div className="flex items-center">
                      <div className="flex items-center h-full">
                        <span
                          className={`sm:hidden h-2 w-2 rounded-full bg-${
                            getTestCategory(test).color
                          } mr-2`}
                        ></span>
                        <span
                          className={`hidden sm:block lg:hidden text-${
                            getTestCategory(test).color
                          } font-mono font-extrabold mr-1`}
                        >
                          [
                          {getTestCategory(test).text.match(/[A-Z]/g)?.join("")}
                          ]
                        </span>
                        <span
                          className={`hidden lg:block text-${
                            getTestCategory(test).color
                          } font-mono font-semibold mr-2 truncate`}
                        >
                          [{getTestCategory(test).text.toUpperCase()}]
                        </span>
                      </div>
                      <div className="h-full w-5 mr-2">
                        <UserIcon
                          className={`h-5 w-5 ${
                            !test.patient
                              ? "text-gray-700"
                              : test.patient.sex === "Masculino"
                              ? "text-sky-600"
                              : "text-pink-400"
                          }`}
                        />
                      </div>
                      <p className="text-gray-500 font-semibold w-40 sm:w-44 text-sm sm:text-base">
                        {new Date(test.date).format("DD/MM/YYYY HH:MM A")}
                      </p>
                      <p
                        className={`${
                          test.labId ? "text-gray-500" : "text-gray-400"
                        } font-semibold flex items-center md:w-64 mr-2.5 md:mr-0`}
                      >
                        <OfficeBuildingIcon
                          className={`h-5 w-5 ${
                            !test.labId ? "text-zinc-400" : "text-zinc-600"
                          } md:text-zinc-400`}
                        />
                        <span className="hidden md:block truncate">
                          : {test.lab?.name || "Sin laboratorio"}
                        </span>
                      </p>
                      <p
                        className={`${
                          test.patientId ? "text-gray-500" : "text-gray-400"
                        } font-semibold flex items-center md:w-36 mr-2 md:mr-0`}
                      >
                        <IdentificationIcon
                          className={`h-5 w-5 ${
                            !test.patientId ? "text-zinc-400" : "text-zinc-600"
                          } md:text-zinc-400`}
                        />
                        <span className="hidden md:block truncate">
                          : {test.patient?.dui || "Sin paciente"}
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center truncate">
                      {test.validatorId && (
                        <BadgeCheckIcon className="h-5 min-w-5 mr-2 text-teal-500" />
                      )}
                      <DocumentDownloadIcon
                        onClick={async (e) => {
                          e.preventDefault();
                          const _accessLink = await getAccessLink(test.id!);
                          if (_accessLink instanceof ResponseError)
                            return unexpectedError(_accessLink);
                          window.open(_accessLink, "_blank");
                        }}
                        className="h-5 min-w-5 mr-2 text-red-500 hover:text-red-900 cursor-pointer"
                      />
                      {/* <DocumentReportIcon className="h-5 w-5 mr-2 text-green-700 hover:text-green-900" />
                  <DocumentTextIcon className="h-5 w-5 mr-2 text-blue-500 hover:text-blue-700" /> */}
                      <p
                        className={`text-gray-500 font-semibold text-sm sm:text-base hidden sm:block truncate`}
                      >
                        [
                        {(
                          JSON.parse(JSON.stringify(test.tests, ["name"])) as {
                            name: string;
                          }[]
                        ).map(
                          ({ name }, idx) =>
                            (idx ? ", " : "") + name?.replace("-PS", "")
                        )}
                        ]{/* [{"name":"GLU-PS"},{"name":"TCHO-PS"}] */}
                      </p>
                      <TrashIcon
                        onClick={async (e) => {
                          e.stopPropagation();
                          //setDeleteTestModalOpen(true);
                          const deleteTestConfirm = await showModal({
                            icon: "warning",
                            body: `¿Realmente desea eliminar el test "<b>${test.id}</b>"?`,
                            buttons: "Delete",
                            submitButtonText: "Eliminar",
                          });
                          if (!deleteTestConfirm) return;
                          const isDeleted = await deleteTest(test.id!);
                          if (isDeleted instanceof ResponseError)
                            return unexpectedError(isDeleted);
                          setTests((_tests) =>
                            _tests!.filter(({ id }) => id !== test.id)
                          );
                        }}
                        className="h-5 min-w-5 ml-2 text-gray-400 hover:text-red-500"
                      />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      )}
    </div>
  );
};

export default dynamic(() => Promise.resolve(React.memo(index)), {
  ssr: false,
});
