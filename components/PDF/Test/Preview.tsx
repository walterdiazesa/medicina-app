import Image from "next/image";
import React from "react";
import { Test } from "../../../types/Prisma/Test";

const HeaderItem = ({ item }: { item: string[] }) => {
  return (
    <p className="font-bold text-sm">
      {item[0]}: <span className="font-semibold">{item[1]}</span>
    </p>
  );
};

const PDFPreview = ({ test }: { test: Test }) => {
  return (
    <div className="bg-gray-100 w-a4 h-a4 px-[5mm] py-[7mm] flex flex-col">
      <div className="flex">
        <div className="w-[10.5cm] h-[3cm]">
          <HeaderItem item={["Solicitud", test.id!]} />
          <HeaderItem
            item={[
              "Fecha y hora de la prueba",
              new Date(test.date).toLocaleString(),
            ]}
          />
          <HeaderItem item={["Paciente", "Desconocido"]} />
          <HeaderItem item={["Sexo", test.sex]} />
          <HeaderItem item={["Edad", "Desconocida"]} />
        </div>
        <div className="w-[10.5cm] h-[3cm]">
          <div className="w-[9.5cm] h-[3cm] relative px-[0.5cm] float-right">
            <Image
              src="/test-pdf/logo.png"
              alt="lab_logo"
              layout="fill"
              objectFit="contain"
            />
          </div>
        </div>
      </div>
      <div className="bg-blue-100 flex font-semibold text-sm py-1 mt-3">
        <span className="w-[7cm] pl-[0.2cm]">Prueba</span>
        <span className="w-[5cm]">Resultado</span>
        <span className="w-[2.8cm]">Unidad</span>
        <span className="w-[6cm]">Rango de referencia</span>
      </div>
      {test.tests.map((item) => (
        <div className="flex font-semibold text-sm py-1" key={item.name}>
          <span className="w-[7cm] pl-[0.2cm]">
            {item.name} {item.assign}
          </span>
          <span className="w-[5cm]">
            {item.value.replace(/[a-zA-Z]/g, "").replace("/", "")}
          </span>
          <span className="w-[2.8cm]">{item.value.replace(/\d/g, "")}</span>
          <span className="w-[6cm]">
            {!item.range
              ? "-"
              : `(${item.range.item}) ${item.range.between.from} - ${item.range.between.to}`}
          </span>
        </div>
      ))}
      <div className="grow" />
      <div className="flex items-end">
        <div className="w-[3cm] h-[1.5cm] relative mb-2">
          <Image
            src="/test-pdf/firma.png"
            alt="firma_encargadolab"
            layout="fill"
            objectFit="contain"
          />
        </div>
        <div className="w-[6cm] h-[2.5cm] ml-3 relative">
          <Image
            src="/test-pdf/sello.png"
            alt="sello_encargadolab"
            layout="fill"
            objectFit="contain"
          />
        </div>
        <div className="w-[6cm] h-[2.5cm] relative ml-auto">
          <Image
            src="/test-pdf/sellolab.png"
            alt="sello_lab"
            layout="fill"
            objectFit="contain"
          />
        </div>
      </div>
      <p className="text-sm">Verónica Alejandra Meléndez Valenzuela</p>
      <p className="text-sm">Encargada de laboratorio</p>
      <div className="w-full bg-blue-100 min-h-[2mm] my-[1.5mm]" />
      <p className="text-sm">
        44 Avenida Norte, Paseo Gral. Escalón, Edificio clínico n.3425 San
        Salvador, El Salvador
      </p>
      <p className="text-sm">2251-6456</p>
      <p className="text-sm text-blue-500">www.testinglaboratorysv.com</p>
    </div>
  );
};

export default PDFPreview;
