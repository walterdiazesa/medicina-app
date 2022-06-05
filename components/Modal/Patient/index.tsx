import { Dialog } from "@headlessui/react";
import {
  AcademicCapIcon,
  AtSymbolIcon,
  IdentificationIcon,
  LinkIcon,
  PhoneIcon,
  UserIcon,
} from "@heroicons/react/outline";
import React, { useState } from "react";
import { Input, SearchList, DatePicker, Gender } from "../../";
import { Patient } from "../../../types/Prisma";

const EditModal = ({
  type,
  patient,
  fromQuery,
}:
  | { type: "create"; patient?: undefined; fromQuery?: string }
  | { type: "edit"; patient: Patient; fromQuery?: undefined }) => {
  const [bornDate, setBornDate] = useState<Date>();

  return (
    <div className="bg-white pt-6 px-4 sm:px-6 pb-3 rounded-t-lg">
      <div className="text-center sm:text-left">
        <Dialog.Title
          as="h3"
          className="text-lg leading-6 font-medium text-gray-900 sm:flex items-center block"
        >
          <UserIcon
            className="h-7 w-7 text-gray-500 inline-block sm:block mr-1.5"
            aria-hidden="true"
          />
          {type === "create"
            ? "Agregar paciente"
            : `Editar paciente "${patient.dui}`}
        </Dialog.Title>
        <div className="mt-2">
          <Input
            placeholder="Ingrese el nombre del paciente"
            type="text"
            name="name"
            className="w-full mt-3"
            autofocus
            {...((type === "edit" || fromQuery) && {
              defaultValue: fromQuery || patient?.name,
            })}
          />
          <div className="relative">
            <Input
              placeholder="Ingrese el documento único del paciente"
              type="text"
              name="dui"
              className="mt-3"
              {...(type === "edit" && { defaultValue: patient.dui })}
              icon={
                <IdentificationIcon className="w-4 h-4 focus:outline-none focus:shadow-outline" />
              }
            />
            <Gender
              name="sex"
              placeholder="Selecciona el género del paciente"
              className="z-3"
            />
            <Input
              placeholder="Ingrese el correo del paciente"
              type="text"
              name="email"
              className="mt-3"
              {...(type === "edit" && { defaultValue: patient.email })}
              icon={
                <AtSymbolIcon className="w-4 h-4 focus:outline-none focus:shadow-outline" />
              }
            />
            <Input
              placeholder="Ingrese el número telefónico del paciente"
              type="text"
              name="phone"
              className="mt-3"
              icon={
                <PhoneIcon className="w-4 h-4 focus:outline-none focus:shadow-outline" />
              }
            />
            <DatePicker
              placeholder="Selecciona la fecha de nacimiento"
              className="mt-3 z-2"
              {...(type === "edit" && {
                defaultValue: patient.dateBorn,
              })}
              fromDate={new Date().change("year", -120)}
              toDate={new Date().change("year", -18)}
              onChange={(date) => setBornDate(date)}
              name="dateBorn"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
