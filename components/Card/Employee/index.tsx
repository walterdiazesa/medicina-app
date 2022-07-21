/* eslint-disable react-hooks/rules-of-hooks */
import {
  BadgeCheckIcon,
  BriefcaseIcon,
  LogoutIcon,
} from "@heroicons/react/outline";
import React, { useState } from "react";
import { ButtonWithIcon } from "../..";
import { patchUsers as removeUser, updateOwner } from "../../../axios/Lab";
import { LabWithEmployeeInfo, UserType } from "../../../types/Prisma";
import { Spinner } from "../../Icons";
import { showModal } from "../../Modal/showModal";

const index = ({
  user,
  labId,
  index,
  setLabInfo,
}: {
  user: UserType;
  labId: string;
  index: number;
  setLabInfo: React.Dispatch<
    React.SetStateAction<LabWithEmployeeInfo[] | null | undefined>
  >;
}) => {
  const { id, name, slug, email, owner } = user;
  const [loadingEmployeeRole, setLoadingEmployeeRole] = useState(false);
  const [loadingEmployeeDeleting, setLoadingEmployeeDeleting] = useState(false);

  return (
    <div className="flex items-center justify-between my-2">
      <p className="mr-2 text-gray-700 flex items-center truncate">
        {name}
        <span className="hidden sm:block ml-1 font-semibold">{email}</span>
        <span className="hidden sm:block ml-1">{slug}</span>
      </p>
      <div className="flex items-center min-w-fit">
        <ButtonWithIcon
          text={`${loadingEmployeeRole ? "Haciendo" : "Hacer"} ${
            owner ? "empleado" : "encargado"
          }`}
          className="py-1 font-semibold text-sm"
          textClassName="hidden sm:block"
          disabled={loadingEmployeeRole}
          onClick={() => {
            setLoadingEmployeeRole(true);
            updateOwner({
              labId,
              owner: id,
              type: owner ? "REMOVE" : "ADD",
            }).then((response) => {
              if (!response)
                return showModal({
                  icon: "error",
                  title: `No se pudieron actualizar los roles`,
                  timer: 1500,
                });
              setLabInfo((_labInfo) => {
                const _labs = [..._labInfo!];
                const labIdx = _labs.findIndex((lab) => lab.id === labId);
                _labs[labIdx].employees[index].owner = !owner;
                return _labs;
              });
              setLoadingEmployeeRole(false);
            });
          }}
        >
          {loadingEmployeeRole ? (
            <Spinner className="mr-1" />
          ) : owner ? (
            <BriefcaseIcon className="text-white h-5 w-5" />
          ) : (
            <BadgeCheckIcon className="text-white h-5 w-5" />
          )}
        </ButtonWithIcon>
        <ButtonWithIcon
          text={`${
            loadingEmployeeDeleting ? "Removiendo" : "Remover"
          } del laboratorio`}
          className={`text-sm ml-2 py-1 bg-red-500 border-red-300 ${
            loadingEmployeeDeleting
              ? ""
              : "hover:bg-red-900 hover:border-red-500"
          } font-semibold`}
          textClassName="hidden sm:block"
          disabled={loadingEmployeeDeleting}
          onClick={() => {
            setLoadingEmployeeDeleting(true);
            removeUser({
              labId,
              user: id,
            }).then((response) => {
              if (!response)
                return showModal({
                  icon: "error",
                  title: `No se pudo eliminar al empleado`,
                  timer: 1500,
                });
              setLabInfo((_labInfo) => {
                const _labs = [..._labInfo!];
                const labIdx = _labs.findIndex((lab) => lab.id === labId);
                _labs[labIdx].employees.splice(index, 1);
                return _labs;
              });
              setLoadingEmployeeDeleting(false);
            });
          }}
        >
          {loadingEmployeeDeleting ? (
            <Spinner className="mr-1" />
          ) : (
            <LogoutIcon className="text-white h-5 w-5" />
          )}
        </ButtonWithIcon>
      </div>
    </div>
  );
};

export default index;
