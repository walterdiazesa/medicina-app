/* eslint-disable react-hooks/rules-of-hooks */
import {
  ArrowLeftIcon,
  SearchIcon,
  XCircleIcon,
} from "@heroicons/react/outline";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { mine } from "../../axios/Lab";
import { Input } from "../../components";
import { Spinner } from "../../components/Icons";
import Lab from "../../components/Pages/Lab";
import { Auth } from "../../types/Auth";
import { LabWithEmployeeInfo } from "../../types/Prisma";

const index = ({
  auth,
  setAuth,
}: {
  auth: Auth;
  setAuth: React.Dispatch<React.SetStateAction<Auth>>;
}) => {
  const [labInfo, setLabInfo] = useState<LabWithEmployeeInfo[] | null>();

  useEffect(() => {
    mine(true).then((lab) => {
      if (!lab) return;
      const _labInfo = Array.isArray(lab) ? lab : [lab];
      _labInfo.forEach((_lab) => {
        _lab.employees = [];
      });

      _labInfo.forEach((_lab) => {
        const empSet = new Set();
        _lab.Owners.map((owner) => {
          empSet.add(owner.id);
          _lab.employees.push({ ...owner, owner: true });
        });
        _lab.Users.map((employee) => {
          if (!empSet.has(employee.id))
            _lab.employees.push({ ...employee, owner: false });
        });
        _lab.employees = _lab.employees.sort((empA, empB) =>
          empA.name.localeCompare(empB.name)
        );
        delete (_lab as any).Owners;
        delete (_lab as any).Users;
      });

      /* if (_labInfo.length > 1)
        for (let i = 0; i < _labInfo.length; i++) {
          // TODO: In case the Promise method fail, Promise.all([signature, stamp]) here
          if (_labInfo[i].signature || _labInfo[i].stamp)
            _labInfo[i] = {
              ..._labInfo[i],
              ...(_labInfo[i].signature && {
                signature: await fetch(_labInfo[i].signature!)
                  .then((_) => _.blob())
                  .then((_) => URL.createObjectURL(_)),
              }),
              ...(_labInfo[i].stamp && {
                stamp: await fetch(_labInfo[i].stamp!)
                  .then((_) => _.blob())
                  .then((_) => URL.createObjectURL(_)),
              }),
            };
        } */

      if (_labInfo.length > 1)
        (async () => {
          const promiseLabInfo = [..._labInfo];
          let promiseQueue = promiseLabInfo.length;
          for (let i = 0; i < promiseLabInfo.length; i++) {
            const lab = promiseLabInfo[i];
            const requestSignatures: Promise<Response | string>[] = [];
            requestSignatures.push(
              lab.signature ? fetch(lab.signature!) : Promise.resolve("")
            );
            requestSignatures.push(
              lab.stamp ? fetch(lab.stamp!) : Promise.resolve("")
            );
            if (!requestSignatures.length) {
              promiseQueue--;
              continue;
            }
            Promise.all(requestSignatures).then(
              ([signatureFetch, stampSignature]) => {
                const requestBlob: Promise<Blob | string>[] = [];
                requestBlob.push(
                  lab.signature
                    ? (signatureFetch as Response).blob()
                    : Promise.resolve("")
                );
                requestBlob.push(
                  lab.stamp
                    ? (stampSignature as Response).blob()
                    : Promise.resolve("")
                );
                Promise.all(requestBlob).then(([signatureBlob, stampBlob]) => {
                  if (lab.signature && signatureBlob)
                    promiseLabInfo[i].signature = URL.createObjectURL(
                      signatureBlob as Blob
                    );
                  if (lab.stamp && stampBlob)
                    promiseLabInfo[i].stamp = URL.createObjectURL(
                      stampBlob as Blob
                    );
                  promiseQueue--;
                  // TODO: ¿Redundant?
                  if (!promiseQueue) setLabInfo(promiseLabInfo); // [...promiseLabInfo?]
                });
              }
            );
          }
        })();
      setLabInfo(_labInfo);
    });
  }, []);

  const [labQuery, setLabQuery] = useState("");
  const queryLabs = useMemo(() => {
    return labInfo && labQuery
      ? labInfo.filter(
          (lab) =>
            lab.name.normalizeQuery().includes(labQuery.normalizeQuery()) ||
            lab.address.normalizeQuery().includes(labQuery.normalizeQuery())
        )
      : labInfo;
  }, [labQuery, labInfo]);

  const [selectedLab, setSelectedLab] = useState<number>();

  return (
    <div className="mt-2 md:mt-8">
      {labInfo === undefined ? (
        <p className="text-gray-500 animate-pulse flex items-center">
          <Spinner pulse className="mr-2" color="text-gray-500" />
          Obteniendo información del laboratorio
        </p>
      ) : labInfo === null ? (
        <p className="text-red-400 flex items-center">
          <XCircleIcon className="h-6 w-6 mr-2" />
          Ocurrió un error obteniendo la información del laboratorio.
        </p>
      ) : selectedLab !== undefined || labInfo.length === 1 ? (
        <>
          {selectedLab !== undefined && (
            <p
              onClick={() => setSelectedLab(undefined)}
              className="flex items-center text-gray-400 hover:text-gray-500 cursor-pointer mb-3"
            >
              <ArrowLeftIcon className="mr-2 h-5 w-5" />
              Regresar a &quot;Todos los laboratorios&quot;
            </p>
          )}
          <Lab
            key={labInfo[selectedLab ?? 0].id}
            lab={labInfo[selectedLab ?? 0]}
            labIdx={selectedLab ?? 0}
            labInfo={labInfo}
            setLabInfo={setLabInfo}
            auth={auth}
            setAuth={setAuth}
          />
        </>
      ) : (
        <>
          <Input
            placeholder="Escribe el nombre o dirección del laboratorio"
            type="text"
            defaultValue={labQuery}
            autofocus
            name="search"
            icon={<SearchIcon className="w-5 h-5 text-gray-400" />}
            onChange={(e) => {
              const query = e.target.value;
              setLabQuery(query);
            }}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {queryLabs?.map((lab) => (
              <div
                key={lab.id}
                className="rounded-md bg-gray-100 hover:bg-gray-200 p-2 shadow-md justify-between cursor-pointer"
                onClick={() =>
                  setSelectedLab(
                    labInfo.findIndex(({ id }) => lab.id === id) ?? undefined
                  )
                }
              >
                <div className="my-2 w-full h-16 max-w-full relative">
                  <Image
                    src={lab.img}
                    alt={`lab_${lab.id}_img`}
                    layout="fill"
                    objectFit="contain"
                    priority
                    quality={40}
                  />
                </div>
                <p className="text-center font-semibold">{lab.name}</p>
                <p className="text-gray-600 text-sm">{lab.address}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default index;
