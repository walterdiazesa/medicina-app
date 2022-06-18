/* eslint-disable react-hooks/rules-of-hooks */
import {
  AtSymbolIcon,
  BadgeCheckIcon,
  BriefcaseIcon,
  DownloadIcon,
  LogoutIcon,
  OfficeBuildingIcon,
  UserAddIcon,
  UserIcon,
  XCircleIcon,
} from "@heroicons/react/outline";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { URLSearchParams } from "url";
import { requestPutObjectURL } from "../../axios/Files";
import {
  mine,
  patchUsers as inviteUser,
  updateLab,
  updateOwner,
} from "../../axios/Lab";
import { get } from "../../axios/User";
import { Attachment, ButtonWithIcon, Input } from "../../components";
import { EmployeeCard } from "../../components/Card";
import { Spinner } from "../../components/Icons";
import { Auth } from "../../types/Auth";
import { Lab, LabWithEmployeeInfo, User, UserType } from "../../types/Prisma";
import { ResponseError } from "../../types/Responses";

const index = ({
  auth,
  setAuth,
}: {
  auth: Auth;
  setAuth: React.Dispatch<React.SetStateAction<Auth>>;
}) => {
  const [loadingInviteEmployee, setLoadingInviteEmployee] = useState(false);
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
      ) : (
        labInfo.map((lab, labIdx) => (
          <div key={lab.id}>
            <p>
              ID: <span className="font-semibold">{lab.id}</span>
            </p>
            <p>
              Nombre: <span className="font-semibold">{lab.name}</span>
            </p>
            <p>
              Email en reporte:{" "}
              <span className="font-semibold">{lab.publicEmail}</span>
            </p>
            <p>
              Teléfono en reporte:{" "}
              <span className="font-semibold">{lab.publicPhone}</span>
            </p>
            <p>
              Dirección en reporte:{" "}
              <span className="font-semibold">{lab.address}</span>
            </p>
            {lab.img && (
              <div className="my-2 max-h-44 h-44 relative">
                <Image
                  src={lab.img}
                  alt="profile_img"
                  layout="fill"
                  objectFit="contain"
                  priority
                  quality={100}
                />
              </div>
            )}
            <Attachment
              key={lab.img}
              label={`${lab.img ? "Cambia la" : "Sube una"} foto para ${
                labInfo.length === 1 ? "tu" : "este"
              } laboratorio`}
              className="my-1"
              iconWhenAttached={
                <OfficeBuildingIcon className="w-8 h-8 text-gray-400 group-hover:text-gray-600 animate-pulse" />
              }
              onFileAttached={async (file) => {
                if (!file.type.startsWith("image"))
                  return alert(
                    "La imagen del laboratorio tiene que ser un archivo de imagen."
                  );
                const publicAssetUploadURL = await requestPutObjectURL();

                try {
                  await axios.put(publicAssetUploadURL, file);
                } catch (e) {
                  setLabInfo((_labInfo) => {
                    const _labs = [..._labInfo!];
                    _labs[labIdx].img = `${
                      lab.img
                    }&restartFlemikComponent=${Math.random()}`;
                    return _labs;
                  });
                  return alert("Ocurrió un problema al subir la imagen.");
                }

                const labRequest = await updateLab(lab.id, {
                  img: publicAssetUploadURL.split("?")[0],
                });
                if (labRequest instanceof ResponseError)
                  return alert(JSON.stringify(labRequest));
                setLabInfo((_labInfo) => {
                  const _labs = [..._labInfo!];
                  _labs[labIdx].img = labRequest!.img;
                  return _labs;
                });
                if (labInfo.length === 1)
                  setAuth(
                    (_auth) => ({ ..._auth, img: labRequest.img } as Auth)
                  );
              }}
            />
            <h1 className="text-lg font-semibold mb-2">Empleados</h1>
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
                text={`${
                  loadingInviteEmployee ? "Invitando" : "Invitar"
                } empleado`}
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

                  const alreadyInLab = lab.employees.findIndex(
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
                      labId: lab.id,
                    },
                    "INVITE"
                  );
                  // User already in app
                  if (data.hasOwnProperty("id")) {
                    setLabInfo((_labInfo) => {
                      const _labs = [..._labInfo!];
                      if (
                        !_labs[labIdx].employees.find(
                          (emp) => emp.id === (data! as UserType).id
                        )
                      )
                        _labs[labIdx].employees.unshift(data as UserType);
                      return _labs;
                    });
                  } else {
                    if (data.hasOwnProperty("error")) {
                      if (
                        (data as ResponseError)["error"].key === "redundant"
                      ) {
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
            {!lab.employees.length ? (
              <p className="text-gray-700 flex items-center">
                El laboratorio no cuenta con ningún empleado aún.
              </p>
            ) : (
              auth &&
              lab.employees.map(
                (user, index) =>
                  user.id !== auth["sub-user"] && (
                    <EmployeeCard
                      key={user.id}
                      user={user}
                      labId={lab.id}
                      index={index}
                      setLabInfo={setLabInfo}
                    />
                  )
              )
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default index;
