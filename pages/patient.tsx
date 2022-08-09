/* eslint-disable react-hooks/rules-of-hooks */
import { PencilIcon, SearchIcon, UserAddIcon } from "@heroicons/react/outline";
import React, { useCallback, useRef, useState } from "react";
import { ButtonWithIcon, Input, Modal, PatientModal } from "../components";
import { debounce } from "../utils";
import { create, get, update } from "../axios/Patient";
import { Patient } from "../types/Prisma";
import { ResponseError } from "../types/Responses";
import { unexpectedError } from "../utils/Error";
import { Spinner } from "../components/Icons";
import { PatientCard } from "../components/Card";
import { isValidEmail } from "../utils/Email";
import { showModal } from "../components/Modal/showModal";

const patient = () => {
  const [patients, setPatients] = useState<Patient[] | null>();
  const [isPatientLoading, setPatientLoading] = useState(false);

  const updatePatientQuery = debounce((query: string) => {
    if (!query) return setPatients([]), setPatientLoading(false);
    get(query).then((_patients) => {
      if (!_patients) return setPatients([]), setPatientLoading(false);
      setPatients(_patients);
      setPatientLoading(false);
    });
  }, 1500);

  const onChangePatientQuery = (patientQuery: string) => {
    setPatientLoading(true);
    updatePatientQuery(patientQuery);
  };

  const [isModalPatientOpen, setIsModalPatientOpen] = useState(false);
  const editPatient: React.MutableRefObject<undefined | Patient> = useRef();

  return (
    <div className="my-8">
      <Modal
        open={isModalPatientOpen}
        setOpen={setIsModalPatientOpen}
        buttons={{
          submit: {
            text: editPatient.current ? "Editar" : "Agregar",
            theme: "teal",
          },
          cancel: { text: "Cancelar" },
        }}
        disableCloseWhenTouchOutside
        submitCallback={async (items: Patient) => {
          items["dateBorn"] = new Date(items["dateBorn"]);

          if (!isValidEmail(items.email.trim()))
            return showModal({
              icon: "error",
              title: "El correo proporcionado no es válido",
              buttons: "OK",
              submitButtonText: "Entendido",
            });

          const patient = editPatient.current
            ? await update(editPatient.current.id, items)
            : await create(items);
          if (patient instanceof ResponseError) return unexpectedError(patient);
          setPatients((_patients) => {
            const patientsList = _patients ? [..._patients] : [];
            if (editPatient.current) {
              const idx = patientsList.findIndex(({ id }) => patient.id === id);
              patientsList[idx] = { ...patient };
            } else patientsList.unshift(patient);
            return patientsList;
          });
        }}
        requiredItems={
          new Set(["name", "dui", "sex", "email", "phone", "dateBorn"])
        }
        /* initialFocus="submit" */
      >
        {!editPatient.current ? (
          <PatientModal type="create" />
        ) : (
          <PatientModal type="edit" patient={editPatient.current} />
        )}
      </Modal>
      <div className="flex items-center">
        <Input
          placeholder="Busca por algún identificador del paciente"
          type="text"
          autofocus
          name="searchpatient"
          icon={<SearchIcon className="w-5 h-5 text-gray-400" />}
          onChange={(e) => onChangePatientQuery(e.target.value)}
        />
        <ButtonWithIcon
          text="Agregar paciente"
          className="min-w-fit py-1 ml-3"
          textClassName="font-normal hidden sm:block"
          onClick={() => {
            editPatient.current = undefined;
            setIsModalPatientOpen(true);
          }}
        >
          <UserAddIcon className="h-5 w-5 text-white" />
        </ButtonWithIcon>
      </div>
      <div className="mt-4">
        {!(
          document.querySelector(`[name="searchpatient"]`) as HTMLInputElement
        )?.value.trim() &&
        (!patients || !patients.length) ? (
          <h2 className="mt-8 text-xl font-semibold text-gray-400 flex items-center justify-center min-w-full">
            Introduce un término de búsqueda para mostrar los pacientes.
          </h2>
        ) : isPatientLoading || !patients ? (
          <h2 className="mt-8 text-xl font-semibold text-gray-400 animate-pulse flex items-center justify-center min-w-full">
            <Spinner color="text-gray-400" />
            Buscando pacientes...
          </h2>
        ) : patients.length ? (
          patients.map((_patient) => (
            <div
              key={_patient.id}
              className="rounded-md shadow-lg bg-white px-4 py-2 my-4 sm:flex justify-between items-center"
            >
              <PatientCard {..._patient} />
              <PencilIcon
                onClick={() => {
                  editPatient.current = {
                    ..._patient,
                    dateBorn: new Date(_patient.dateBorn),
                  };
                  setIsModalPatientOpen(true);
                }}
                className="h-5 w-5 text-gray-400 hover:text-gray-600 cursor-pointer"
              />
            </div>
          ))
        ) : (
          <h2 className="mt-8 text-xl font-semibold text-gray-400 flex items-center justify-center min-w-full">
            Ningún paciente con los parámetros solicitados encontrado.
          </h2>
        )}
      </div>
    </div>
  );
};

export default patient;
