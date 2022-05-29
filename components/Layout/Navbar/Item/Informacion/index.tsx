import { Menu } from "@headlessui/react";
import React from "react";

const index = ({ close }: { close: () => void }) => {
  return (
    <>
      <Menu.Item>
        {({ active }) => (
          <a
            className={
              (active && "bg-gray-300") +
              " cursor-pointer block px-4 py-2 text-sm text-gray-500"
            }
            onClick={() => close()}
          >
            CHEMs compatibles
          </a>
        )}
      </Menu.Item>
      <Menu.Item>
        {({ active }) => (
          <a
            className={
              (active && "bg-gray-300") +
              " cursor-pointer block px-4 py-2 text-sm text-gray-500"
            }
            onClick={() => close()}
          >
            ¿Quién necesita esto?
          </a>
        )}
      </Menu.Item>
      <Menu.Item>
        {({ active }) => (
          <a
            className={
              (active && "bg-gray-300") +
              " cursor-pointer block px-4 py-2 text-sm text-gray-500"
            }
            onClick={() => close()}
          >
            ¿Cómo se usa?
          </a>
        )}
      </Menu.Item>
      <Menu.Item>
        {({ active }) => (
          <a
            className={
              (active && "bg-gray-300") +
              " cursor-pointer block px-4 py-2 text-sm text-gray-500"
            }
            onClick={() => close()}
          >
            Seguridad
          </a>
        )}
      </Menu.Item>
    </>
  );
};

export default index;
