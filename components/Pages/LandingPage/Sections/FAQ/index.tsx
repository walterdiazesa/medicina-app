import { Menu } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/outline";
import React from "react";
import Transition from "../../../../Transition";

const FAQS: { q: string; a: string }[] = [
  {
    q: "¿Quién necesita esto?",
    a: "Cualquier laboratorio de química seca o hematología que esté en búsqueda de automatizar sus procesos, centralizar su información y mejorar su productividad.",
  },
  {
    q: "CHEMs compatibles",
    a: `<ul class="list-disc">
          <li>Fujifilm NX500</li>
          <li><b>(próximamente)</b> Fujifilm NX600</li>
          <li><b>(próximamente)</b> Fujifilm NX700</li>
        </ul>`,
  },
  {
    q: "¿Cómo se usa?",
    a: `<ul>
          <li>1- <a href="/register" class="text-teal-500 hover:text-teal-300">Crea tu laboratorio</a></li>
          <li>2- Descarga el <a href="/about-listener" class="text-teal-500 hover:text-teal-300">ejecutable</a> que se genera al crear tu laboratorio</li>
          <li>3- Elije alguno de los <a href="/pricing" class="text-teal-500 hover:text-teal-300">planes</a> que se adecúe a las necesidades de tu laboratorio</li>
          <li>4- Sigue los pasos de nuestra <a href="/quick-start" class="text-teal-500 hover:text-teal-300">guía de inicio rápido</a> para capturar los exámenes tu equipo de análisis químico</li>
          <li>5- ¡Crea tu primer exámen y espera que aparezca instantáneamente en la página de <a href="/about-listener" class="text-teal-500 hover:text-teal-300">exámenes</a> de tu laboratorio!</li>
        </ul>`,
  },
];

const index = () => {
  return (
    <div
      id="faq_section"
      className="animate-on-scroll mt-16 mb-24 px-4 sm:px-8"
    >
      <h1 className="font-bold text-2xl">Preguntas más frecuentes</h1>
      <div className="my-4">
        {FAQS.map(({ q, a }, index) => (
          <Menu key={index} as="div" className="my-3 ring-0">
            {({ open }) => (
              <>
                <Menu.Button
                  className={`w-full flex items-center justify-between px-8 py-3 bg-gray-200 hover:bg-gray-300 ring-0 ${
                    open ? "rounded-t-md border-b-2" : "rounded-md"
                  } cursor-pointer border-b-gray-800 border-opacity-5`}
                >
                  <p>{q}</p>
                  <ChevronDownIcon className="text-gray-600 h-5 w-5" />
                </Menu.Button>
                <Transition isOpen={open}>
                  <Menu.Items
                    static
                    className="origin-top w-full rounded-b-md shadow-sm py-1 bg-gray-100 ring-0"
                  >
                    <p
                      className="text-left px-8"
                      dangerouslySetInnerHTML={{ __html: a }}
                    />
                  </Menu.Items>
                </Transition>
              </>
            )}
          </Menu>
        ))}
      </div>
    </div>
  );
};

export default index;
