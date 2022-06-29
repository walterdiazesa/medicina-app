import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationIcon,
  InformationCircleIcon,
  QuestionMarkCircleIcon,
  XCircleIcon,
} from "@heroicons/react/outline";
import { showModal } from "./showModal";

type Button = {
  text: string;
};
interface SubmitButton extends Button {
  theme?: "teal" | "red" | "gray";
}

const Modal = ({
  open,
  setOpen,
  children,
  title,
  desc,
  buttons,
  initialFocus,
  icon,
  submitCallback,
  disableCloseWhenTouchOutside,
  requiredItems,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  buttons?:
    | { submit: SubmitButton; cancel: Button }
    | { submit: SubmitButton; cancel?: Button };
  initialFocus?: string;
  icon?: "warning" | "info" | "error" | "success" | "question";
  submitCallback?: (args: any) => void;
  disableCloseWhenTouchOutside?: true;
  requiredItems?: Set<string> | { items: Set<string>; message?: string };
} & (
  | { children: JSX.Element; title?: null; desc?: null }
  | { title: string; desc: string; children?: null }
)) => {
  const focusRef = useRef(null);

  const Icon = () => {
    switch (icon) {
      case "error":
        return (
          <XCircleIcon
            className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10 bg-red-100 text-red-600"
            aria-hidden="true"
          />
        );
      case "info":
        return (
          <InformationCircleIcon
            className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10 bg-blue-50 text-blue-400"
            aria-hidden="true"
          />
        );
      case "question":
        return (
          <QuestionMarkCircleIcon
            className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10 bg-indigo-50 text-indigo-600"
            aria-hidden="true"
          />
        );
      case "success":
        return (
          <CheckCircleIcon
            className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10 bg-teal-50 text-teal-700"
            aria-hidden="true"
          />
        );
      case "warning":
        return (
          <ExclamationCircleIcon
            className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10 bg-yellow-50 text-yellow-700"
            aria-hidden="true"
          />
        );
    }
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed flex justify-center sm:block z-50 inset-0 overflow-y-auto"
        initialFocus={focusRef}
        onClose={setOpen}
      >
        <div className="grid items-center w-full min-h-screen py-4 px-4 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay
              className={`fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity ${
                disableCloseWhenTouchOutside ? "pointer-events-none" : ""
              }`}
            />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg text-left shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              {children ? (
                <form id="modal_form">{children}</form>
              ) : (
                <div
                  className={`bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 ${
                    !buttons ? "rounded-b-lg" : ""
                  }`}
                >
                  <div className="sm:flex sm:items-start">
                    {icon && Icon()}
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-lg leading-6 font-medium text-gray-900"
                      >
                        {title}
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">{desc}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {buttons && (
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
                  <button
                    type="button"
                    className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white ${
                      buttons.submit.theme === "teal"
                        ? "bg-teal-500 hover:bg-teal-400 focus:ring-teal-700"
                        : buttons.submit.theme === "red"
                        ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                        : "bg-gray-400 hover:bg-gray-500 focus:ring-gray-400"
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm`}
                    onClick={() => {
                      const modalForm = document.getElementById(
                        "modal_form"
                      ) as HTMLFormElement;
                      const formData = new FormData(modalForm);

                      if (requiredItems) {
                        let _requiredItems =
                          requiredItems instanceof Set
                            ? requiredItems
                            : requiredItems.items;
                        let isInvalidForm: { field: HTMLInputElement } | false =
                          false;
                        formData.forEach((value, key, field) => {
                          if (isInvalidForm) return;
                          if (_requiredItems.has(key))
                            if (!value.toString().trim())
                              return (isInvalidForm = {
                                field: modalForm.querySelector(
                                  `[name="${key}"]`
                                )!,
                              });
                            else _requiredItems.delete(key);
                        });
                        if (isInvalidForm || _requiredItems.size) {
                          if (isInvalidForm)
                            (
                              isInvalidForm as { field: HTMLInputElement }
                            ).field.focus();
                          return showModal({
                            icon: "error",
                            title:
                              requiredItems instanceof Set ||
                              !requiredItems.message
                                ? "No puedes dejar ningún campo vacío"
                                : requiredItems.message,
                            buttons: "OK",
                            submitButtonText: "Entendido",
                          });
                        }
                      }
                      if (submitCallback)
                        submitCallback(Object.fromEntries(formData));
                      setOpen(false);
                    }}
                    ref={initialFocus === "submit" ? focusRef : undefined}
                  >
                    {buttons.submit.text}
                  </button>
                  {buttons.cancel && (
                    <button
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-300 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={() => setOpen(false)}
                      ref={initialFocus === "cancel" ? focusRef : undefined}
                    >
                      {buttons.cancel.text}
                    </button>
                  )}
                </div>
              )}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default Modal;
