import { Menu } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/outline";
import React from "react";
import Transition from "../../../../Transition";

const FAQS: { q: string; a: string }[] = [
  {
    q: "¿Quién necesita esto?",
    a: "Cualquier laboratorio de química seca o hematología",
  },
  {
    q: "CHEMs compatibles",
    a: "- Fujifilm NX500",
  },
  {
    q: "¿Cómo se usa?",
    a: "¿Cómo se usa?",
  },
];

const index = () => {
  return (
    <div id="faq_section" className="mt-16 mb-24 px-4 sm:px-8">
      <h1 className="font-bold text-2xl">Preguntas más frecuentes</h1>
      <div className="my-4">
        {FAQS.map(({ q, a }, index) => (
          <Menu key={index} as="div" className="my-3">
            {({ open }) => (
              <>
                <Menu.Button
                  className={`w-full flex items-center justify-between px-8 py-3 bg-gray-200 hover:bg-gray-300 ${
                    open ? "rounded-t-md border-b-2" : "rounded-md"
                  } cursor-pointer border-b-gray-800 border-opacity-5`}
                >
                  <p>{q}</p>
                  <ChevronDownIcon className="text-gray-600 h-5 w-5" />
                </Menu.Button>
                <Transition isOpen={open}>
                  <Menu.Items
                    static
                    className="origin-top w-full rounded-b-md shadow-sm py-1 bg-gray-100"
                  >
                    <p className="text-left px-8">{a}</p>
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
