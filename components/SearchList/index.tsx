/* eslint-disable react-hooks/rules-of-hooks */
import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
  memo,
} from "react";
import { Combobox, Transition } from "@headlessui/react";
import { RefreshIcon, SelectorIcon } from "@heroicons/react/outline";
import { Spinner } from "../Icons/index";

type Item = {
  value: number | string;
  text: string;
  disabled?: boolean | null;
};

const index = ({
  list,
  defaultValue,
  label,
  addCustom,
  onChange,
  onQueryChange,
  loading,
  placeholder,
  className,
}: {
  list: Item[];
  defaultValue?: number | string;
  label?: string;
  addCustom?: boolean;
  onChange?: (item: Item) => void;
  onQueryChange?: (query: string) => void;
  loading?: boolean;
  placeholder?: string;
  className?: string;
}) => {
  const [selectedValue, setSelectedValue] = useState(() => {
    const noItem = { value: -1, text: "" };
    if (list.length === 0 || !defaultValue) return noItem;
    const selectedItem = list.find((item) => item.value === defaultValue);
    return !selectedItem ? noItem : selectedItem;
  });

  useEffect(() => {
    if (onChange && selectedValue) onChange(selectedValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedValue]);

  const [query, setQuery] = useState("");

  const filteredList = useMemo(() => {
    return list.filter((item) =>
      item.text.toLowerCase().includes(query.toLowerCase())
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, list]);

  return (
    <div className={`relative ${className ? className : ""}`}>
      <Combobox
        value={selectedValue}
        onChange={(itemIdx) => {
          setSelectedValue(
            list.find((item) => String(itemIdx) === item.value.toString())!
          );
        }}
      >
        {label && <Combobox.Label>{label}</Combobox.Label>}
        <div className="relative mt-1">
          <div className="relative w-full cursor-default rounded-lg bg-white text-left border-2 border-gray focus:border-gray-600 focus:border-opacity-40 focus:outline-none sm:text-sm">
            <Combobox.Input
              /* as="input" */
              className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-400 focus:outline-none"
              onChange={(event) => {
                if (onQueryChange) onQueryChange(event.target.value);
                setQuery(event.target.value);
              }}
              displayValue={(item: Item) => item.text}
              placeholder={placeholder}
              autoComplete="off"
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <SelectorIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </Combobox.Button>
            <Transition
              as={Fragment}
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto no-scrollbar rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {loading ? (
                  <div className="relative cursor-default select-none py-2 px-4 text-gray-700 animate-pulse flex items-center">
                    <Spinner className="h-4 w-4 animate-spin-fast mr-1.5 mb-0.5" />
                    Buscando...
                  </div>
                ) : filteredList.length === 0 ? (
                  <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                    No hay resultados.
                  </div>
                ) : (
                  filteredList.map((item) => (
                    <Combobox.Option
                      key={item.value}
                      value={item.value}
                      disabled={!!item.disabled}
                      className={({ active, selected }) =>
                        `relative text-sm cursor-pointer select-none py-2 px-3 border-t border-b border-gray-400 border-opacity-20 text-white ${
                          item.value === selectedValue.value
                            ? "bg-teal-600"
                            : active
                            ? "bg-teal-500"
                            : "bg-white text-gray-800"
                        }${!!item.disabled ? " opacity-75" : ""}`
                      }
                    >
                      <span>
                        {/* {selected && <CheckIcon />} */}
                        {item.text}
                      </span>
                    </Combobox.Option>
                  ))
                )}
                {addCustom && query.length >= 2 && (
                  <Combobox.Option
                    value={{ value: null, text: query }}
                    className={({ active, selected }) =>
                      `relative text-sm cursor-pointer select-none py-2 px-3 border-t border-b border-gray-400 border-opacity-15 ${
                        active ? "bg-gray-200 " : "text-gray-800"
                      }`
                    }
                  >
                    {`Añadir "${query}"...`}
                  </Combobox.Option>
                )}
              </Combobox.Options>
            </Transition>
          </div>
        </div>
      </Combobox>
    </div>
  );
};

export default index;
