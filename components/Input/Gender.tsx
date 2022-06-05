import { Menu } from "@headlessui/react";
import { ChevronDownIcon, UserIcon } from "@heroicons/react/outline";
import React, { useEffect, useRef, useState } from "react";
import { Transition } from "../";

const Gender = ({
  name,
  className,
  onChangeValue,
  placeholder,
}: {
  name?: string;
  placeholder?: string;
  className?: string;
  onChangeValue?: (value: string) => void;
}) => {
  const [selectedGender, setSelectedGender] = useState<
    undefined | { element: JSX.Element; value: string }
  >(undefined);

  const genderValueForm = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectedGender) {
      if (onChangeValue)
        setTimeout(() => onChangeValue(selectedGender.value), 0);
      genderValueForm.current!.value = selectedGender.value;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGender]);

  const GenderMale = () => {
    return (
      <>
        <UserIcon className="text-blue-400 w-4 h-4 mr-2" />
        Masculino
      </>
    );
  };

  const GenderFemale = () => {
    return (
      <>
        <UserIcon className="text-pink-400 w-4 h-4 mr-2" />
        Femenino
      </>
    );
  };

  const GenderPriv = () => {
    return (
      <>
        <UserIcon className="text-gray-400 w-4 h-4 mr-2" />
        No especificar
      </>
    );
  };

  return (
    <Menu as="div" className={`${className} relative my-4`}>
      {({ open }) => (
        <>
          <div>
            <input
              type="hidden"
              ref={genderValueForm}
              {...(name && { name })}
            />
            <Menu.Button className="flex w-full py-1.5 text-sm text-gray-400 rounded-md pr-3 pl-3 border-2 border-gray focus:border-gray-600 focus:border-opacity-40 focus:outline-none bg-white focus:text-gray-600">
              {selectedGender?.element || (
                <a>{placeholder || "Selecciona tu género"}</a>
              )}
              <ChevronDownIcon className="text-gray-400 w-4 h-4 ml-auto" />
            </Menu.Button>
          </div>
          <Transition isOpen={open}>
            <Menu.Items
              static
              className="origin-top-left absolute left-0 mt-0.5 w-full rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
            >
              <Menu.Item>
                <a
                  className="flex hover:bg-gray-200 cursor-pointer px-4 py-2 text-sm text-gray-400 font-semibold"
                  onClick={() =>
                    setSelectedGender({
                      element: <GenderMale />,
                      value: "Masculino",
                    })
                  }
                >
                  <GenderMale />
                </a>
              </Menu.Item>
              <Menu.Item>
                <a
                  className="flex hover:bg-gray-200 cursor-pointer px-4 py-2 text-sm text-gray-400 font-semibold"
                  onClick={() =>
                    setSelectedGender({
                      element: <GenderFemale />,
                      value: "Femenino",
                    })
                  }
                >
                  <GenderFemale />
                </a>
              </Menu.Item>
              <Menu.Item>
                <a
                  className="flex hover:bg-gray-200 cursor-pointer px-4 py-2 text-sm text-gray-400 font-semibold"
                  onClick={() =>
                    setSelectedGender({
                      element: <GenderPriv />,
                      value: "No especificado",
                    })
                  }
                >
                  <GenderPriv />
                </a>
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
};

export default Gender;
