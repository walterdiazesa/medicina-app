/* eslint-disable react-hooks/rules-of-hooks */
import {
  AtSymbolIcon,
  BadgeCheckIcon,
  BriefcaseIcon,
  DownloadIcon,
  LogoutIcon,
  UserAddIcon,
  XCircleIcon,
} from "@heroicons/react/outline";
import React, { useEffect, useState } from "react";
import { URLSearchParams } from "url";
import { patchUsers as inviteUser, updateOwner } from "../../axios/Lab";
import { get } from "../../axios/User";
import { ButtonWithIcon, Input } from "../../components";
import { EmployeeCard } from "../../components/Card";
import { Spinner } from "../../components/Icons";
import { Auth } from "../../types/Auth";
import { User, UserType } from "../../types/Prisma";
import { ResponseError } from "../../types/Responses";

const index = ({ auth }: { auth: Auth }) => {
  const [employees, setEmployees] = useState<UserType[] | null>();
  const [loadingInviteEmployee, setLoadingInviteEmployee] = useState(false);

  useEffect(() => {
    get().then((_employees) => {
      if (!_employees) return setEmployees(null);
      const { users, ownersIds } = _employees;
      for (const ownerId of ownersIds) {
        const owner = users.find(({ id }) => id === ownerId);
        if (owner) (owner as UserType).owner = true;
      }
      setEmployees(users as UserType[]);
    });
  }, []);

  return (
    <div className="mt-2 md:mt-8">
      <h1 className="text-lg font-semibold mb-2">Empleados</h1>
      {employees && (
        <div className="flex mb-3">
          <Input
            placeholder="Ingrese el correo del empleado"
            type="text"
            name="email"
            className="mr-2"
            icon={
              <AtSymbolIcon className="w-4 h-4 focus:outline-none focus:shadow-outline" />
            }
            disabled={loadingInviteEmployee}
          />
          <ButtonWithIcon
            text={`${loadingInviteEmployee ? "Invitando" : "Invitar"} empleado`}
            className="py-1 font-semibold text-sm min-w-max"
            textClassName="hidden sm:block"
            onClick={async () => {
              const emailInput = document.querySelector(
                `input[name="email"]`
              ) as HTMLInputElement;
              if (!emailInput || !emailInput.value.trim())
                return alert(
                  "No puedes dejar el correo del empleado a invitar vacío"
                );

              const alreadyInLab = employees.findIndex(
                ({ email }) => email === emailInput.value.trim()
              );
              if (alreadyInLab !== -1) {
                alert(
                  `El empleado con correo "${emailInput.value.trim()}" ya forma parte de este laboratorio`
                );
                emailInput.value = "";
                setTimeout(() => emailInput.focus(), 0);
                return;
              }

              setLoadingInviteEmployee(true);
              const data = await inviteUser(
                {
                  user: emailInput.value.trim(),
                  labId: auth!["sub-lab"]!,
                },
                "INVITE"
              );
              // User already in app
              if (data.hasOwnProperty("id")) {
                setEmployees((_employees) => {
                  return _employees
                    ? [data as UserType, ..._employees]
                    : [data as UserType];
                });
              } else {
                // Invite from mail
                if (data.hasOwnProperty("error")) {
                  if ((data as ResponseError)["error"].key === "redundant") {
                    alert(
                      `El empleado con correo "${emailInput.value.trim()}" ya forma parte de este laboratorio`
                    );
                  } else {
                    alert(JSON.stringify(data));
                  }
                } else {
                  alert(
                    `Se ha enviado una invitación al correo "${emailInput.value.trim()}"`
                  );
                }
              }
              emailInput.value = "";
              setTimeout(() => emailInput.focus(), 0);
              setLoadingInviteEmployee(false);
            }}
            disabled={loadingInviteEmployee}
          >
            {loadingInviteEmployee ? (
              <Spinner className="mr-1" />
            ) : (
              <UserAddIcon className="text-white h-5 w-5" />
            )}
          </ButtonWithIcon>
        </div>
      )}
      {employees === undefined ? (
        <p className="text-gray-500 animate-pulse flex items-center">
          <Spinner pulse className="mr-2" color="text-gray-500" />
          Obteniendo empleados
        </p>
      ) : employees === null ? (
        <p className="text-red-400 flex items-center">
          <XCircleIcon className="h-6 w-6 mr-2" />
          Ocurrió un error obteniendo los empleados del laboratorio.
        </p>
      ) : !employees.length ? (
        <p className="text-gray-700 flex items-center">
          El laboratorio no cuenta con ningún empleado aún.
        </p>
      ) : (
        auth &&
        employees.map(
          (user, index) =>
            user.id !== auth["sub-user"] && (
              <EmployeeCard
                key={user.id}
                user={user}
                labId={auth["sub-lab"]!}
                index={index}
                setEmployees={setEmployees}
              />
            )
        )
      )}
    </div>
  );
};

export default index;
