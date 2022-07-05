/* eslint-disable react-hooks/rules-of-hooks */
import { XCircleIcon } from "@heroicons/react/outline";
import React, { useEffect, useState } from "react";
import { mine } from "../../axios/Lab";
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
      setLabInfo(_labInfo);
    });
  }, []);

  return (
    <div className="mt-2 md:mt-8 max-w-6xl">
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
      ) : (
        labInfo.map((lab, labIdx) => (
          <Lab
            key={lab.id}
            lab={lab}
            labIdx={labIdx}
            labInfo={labInfo}
            setLabInfo={setLabInfo}
            auth={auth}
            setAuth={setAuth}
          />
        ))
      )}
    </div>
  );
};

export default index;
