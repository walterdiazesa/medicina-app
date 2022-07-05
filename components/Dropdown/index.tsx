/* eslint-disable react-hooks/rules-of-hooks */
import { Menu } from "@headlessui/react";
import { ChevronDownIcon, UserIcon } from "@heroicons/react/outline";
import React, { useEffect, useRef, useState } from "react";
import { Transition } from "../";

type Item = { text: string; value: string };

const index = ({
  name,
  items,
  className,
  onChangeValue,
  placeholder,
  defaultValue,
  limit,
}: {
  name?: string;
  items: Item[];
  placeholder: string;
  className?: string;
  onChangeValue?: (value: string) => void;
  defaultValue?: Item;
  limit?: boolean;
}) => {
  const [selectedItem, setSelectedItem] = useState<undefined | Item>(
    defaultValue
  );

  const itemValueForm = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectedItem) {
      if (onChangeValue) setTimeout(() => onChangeValue(selectedItem.value), 0);
      itemValueForm.current!.value = selectedItem.value;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItem]);

  return (
    <Menu as="div" className={`${className} relative`}>
      {({ open }) => (
        <>
          <div>
            <input type="hidden" ref={itemValueForm} {...(name && { name })} />
            <Menu.Button className="flex w-full py-1.5 text-sm text-gray-400 rounded-md pr-3 pl-3 border-2 border-gray focus:border-gray-600 focus:border-opacity-40 focus:outline-none bg-white focus:text-gray-600">
              {selectedItem?.text || <a>{placeholder}</a>}
              <ChevronDownIcon className="text-gray-400 w-4 h-4 ml-auto" />
            </Menu.Button>
          </div>
          <Transition isOpen={open}>
            <Menu.Items
              static
              className={`origin-top-left absolute left-0 mt-0.5 w-full rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none ${
                !limit ? "" : `overflow-y-scroll no-scrollbar max-h-48`
              }`}
            >
              {items.map((item, idx) => (
                <Menu.Item key={`${item.value}_${idx}`}>
                  <a
                    className="flex hover:bg-gray-200 cursor-pointer px-4 py-2 text-sm text-gray-400 font-semibold"
                    onClick={() => setSelectedItem(item)}
                  >
                    {item.text}
                  </a>
                </Menu.Item>
              ))}
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
};

export default index;
