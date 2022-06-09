/* eslint-disable react-hooks/rules-of-hooks */
import {
  BadgeCheckIcon,
  BriefcaseIcon,
  LogoutIcon,
} from "@heroicons/react/outline";
import React, { useState } from "react";
import { ButtonWithIcon } from "../..";
import { patchUsers as removeUser, updateOwner } from "../../../axios/Lab";
import { UserType } from "../../../types/Prisma";
import { Spinner } from "../../Icons";

const index = ({
  user,
  labId,
  index,
  setEmployees,
}: {
  user: UserType;
  labId: string;
  index: number;
  setEmployees: React.Dispatch<
    React.SetStateAction<UserType[] | null | undefined>
  >;
}) => {
  const { id, name, slug, email, profileImg, owner } = user;
  const [loadingEmployeeRole, setLoadingEmployeeRole] = useState(false);
  const [loadingEmployeeDeleting, setLoadingEmployeeDeleting] = useState(false);

  return (
    <div className="flex items-center justify-between my-2">
      <p className="mr-2 text-gray-700 flex items-center truncate">
        {name}
        <span className="hidden sm:block ml-1 font-semibold">{email}</span>
        <span className="hidden sm:block ml-1">{slug}</span>
      </p>
      <div className="flex items-center">
        <ButtonWithIcon
          text={`${loadingEmployeeRole ? "Haciendo" : "Hacer"} ${
            owner ? "empleado" : "encargado"
          }`}
          className="py-1 font-semibold"
          textClassName="hidden sm:block"
          disabled={loadingEmployeeRole}
          onClick={() => {
            setLoadingEmployeeRole(true);
            updateOwner({
              labId,
              owner: id,
              type: owner ? "REMOVE" : "ADD",
            }).then((response) => {
              if (!response) return alert("No se pudo actualizar los roles");
              setEmployees((_employees) => {
                if (!_employees) return _employees;
                const listEmployees = [..._employees];
                if (owner) listEmployees[index].owner = false;
                else listEmployees[index].owner = true;
                return listEmployees;
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
          className={`ml-2 py-1 bg-red-500 border-red-300 ${
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
              if (!response) return alert("No se pudo eliminar al empleado");
              setEmployees((_employees) => {
                if (!_employees) return _employees;
                const listEmployees = [..._employees];
                listEmployees.splice(index, 1);
                return listEmployees;
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
