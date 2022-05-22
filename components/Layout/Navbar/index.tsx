/* eslint-disable react-hooks/rules-of-hooks */
import { Disclosure, Menu } from "@headlessui/react";
import {
  AtSymbolIcon,
  KeyIcon,
  LoginIcon,
  LogoutIcon,
  MenuIcon,
  SearchIcon,
  UserCircleIcon,
  UserIcon,
  XIcon,
} from "@heroicons/react/outline";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { ButtonWithIcon, Transition } from "../..";
import Image from "next/image";

const index = ({
  isAuth,
  setAuth,
}: {
  isAuth: boolean;
  setAuth: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  return (
    <Disclosure as="nav" className="bg-white relative z-50 shadow-md">
      {({ open, close }) => (
        <>
          <div className="px-2 sm:px-6 lg:px-8">
            <div className="relative flex items-center justify-between h-16">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-200">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                <div className="hidden sm:block sm:ml-6">
                  <div className="flex space-x-4">
                    <Link href="/">
                      <a
                        className="bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-400 px-3 py-2 rounded-md text-sm font-semibold"
                        onClick={() => close()}
                      >
                        Inicio
                      </a>
                    </Link>
                    <Menu as="div" className="relative">
                      {({ open }) => (
                        <>
                          <div>
                            <Menu.Button className="flex">
                              <a className="bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-400 px-3 py-2 rounded-md text-sm font-semibold">
                                Servicios
                              </a>
                            </Menu.Button>
                          </div>
                          <Transition isOpen={open}>
                            <Menu.Items
                              static
                              className="origin-top-left absolute left-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-gray-200 ring-1 ring-black ring-opacity-5 focus:outline-none 2xl:z-50"
                            >
                              <Menu.Item>
                                {({ active }) => (
                                  <a
                                    className={
                                      (active && "bg-gray-300") +
                                      " cursor-pointer block px-4 py-2 text-sm text-gray-500"
                                    }
                                    onClick={() => close()}
                                  >
                                    Servicios - Dropdown 1
                                  </a>
                                )}
                              </Menu.Item>
                            </Menu.Items>
                          </Transition>
                        </>
                      )}
                    </Menu>
                  </div>
                </div>
              </div>
              {isAuth ? (
                <>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                    <p className="text-gray-500 hidden md:block">username</p>

                    <Menu as="div" className="ml-3 relative z-50">
                      {({ open }) => (
                        <>
                          <div>
                            <Menu.Button className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                              <span className="sr-only">Open user menu</span>
                              <Image
                                className="h-8 w-8 rounded-full"
                                src={`https://avatars.dicebear.com/api/jdenticon/testlaboratory.svg`}
                                alt="profile"
                                width={32}
                                height={32}
                                layout="fixed"
                                priority
                                quality={100}
                              />
                            </Menu.Button>
                          </div>
                          <Transition isOpen={open}>
                            <Menu.Items
                              static
                              className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-gray-100 ring-1 ring-black ring-opacity-5 focus:outline-none 2xl:z-50"
                            >
                              <Menu.Button as="div">
                                <Link href="/profile">
                                  <a className="hover:bg-gray-200 cursor-pointer flex px-4 py-2 text-sm text-gray-500 items-center">
                                    <UserIcon className="w-4 h-4 mr-1.5" />
                                    <span className="transform translate-y-1.4px">
                                      Mi perfil
                                    </span>
                                  </a>
                                </Link>
                              </Menu.Button>
                              <Menu.Item>
                                <a
                                  className="hover:bg-gray-200 cursor-pointer flex px-4 py-2 text-sm text-gray-500 items-center"
                                  onClick={() => {
                                    setAuth(false);
                                  }}
                                >
                                  <LogoutIcon className="w-4 h-4 mr-1.5" />
                                  <span className="transform translate-y-1.4px">
                                    Cerrar Sesión
                                  </span>
                                </a>
                              </Menu.Item>
                            </Menu.Items>
                          </Transition>
                        </>
                      )}
                    </Menu>
                  </div>
                </>
              ) : (
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  <Menu as="div" className="relative z-50">
                    {({ open }) => (
                      <>
                        <div>
                          <Menu.Button className="bg-gray-100 hover:bg-gray-200 p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-gray-300">
                            <span className="sr-only">Ingresar</span>
                            <UserCircleIcon
                              className="h-6 w-6"
                              aria-hidden="true"
                            />
                          </Menu.Button>
                        </div>
                        <Transition isOpen={open}>
                          <Menu.Items
                            static
                            className="origin-top-right absolute right-0 mt-2 w-72 rounded-md shadow-lg py-1 bg-gray-200 ring-1 ring-black ring-opacity-5 focus:outline-none 2xl:z-50"
                          >
                            <Menu.Item>
                              {({ active }) => (
                                <div className="px-4 py-2">
                                  <div
                                    className="block relative text-gray-400 focus-within:text-gray-600 w-full"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                    }}
                                  >
                                    <input
                                      type="text"
                                      name="email"
                                      className="py-1.5 text-sm text-gray-400 rounded-md pr-8 pl-3 border-2 border-gray focus:border-gray-600 focus:border-opacity-40 focus:outline-none bg-white focus:text-gray-600 w-full"
                                      placeholder="email"
                                      autoComplete="off"
                                    />
                                    <span className="absolute inset-y-0 right-0 flex items-center pr-2">
                                      <AtSymbolIcon className="p-0.5 w-5 h-5 focus:outline-none focus:shadow-outline" />
                                    </span>
                                  </div>
                                  <div
                                    className="block relative text-gray-400 focus-within:text-gray-600 w-full my-2.5"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                    }}
                                  >
                                    <input
                                      type="password"
                                      name="password"
                                      className="py-1.5 text-sm text-gray-400 rounded-md pr-8 pl-3 border-2 border-gray focus:border-gray-600 focus:border-opacity-40 focus:outline-none bg-white focus:text-gray-600 w-full"
                                      placeholder="contraseña"
                                      autoComplete="off"
                                    />
                                    <span className="absolute inset-y-0 right-0 flex items-center pr-2">
                                      <KeyIcon className="p-0.5 w-5 h-5 focus:outline-none focus:shadow-outline" />
                                    </span>
                                  </div>
                                  <ButtonWithIcon
                                    className="text-sm font-medium w-full px-6 py-1.5 justify-center"
                                    text="Ingresar"
                                    onClick={() => setAuth(true)}
                                  >
                                    <LoginIcon
                                      className="w-5 h-5 text-white"
                                      aria-hidden="true"
                                    />
                                  </ButtonWithIcon>
                                  <div className="w-full text-center">
                                    <p className="text-sm text-gray-400 hover:text-gray-500 cursor-pointer mt-2 mb-2 font-semibold">
                                      ¿Olvidaste tu contraseña?
                                    </p>
                                    <Link href="/register">
                                      <a className="text-sm text-gray-400 hover:text-gray-500 cursor-pointer font-semibold">
                                        ¿No tienes una cuenta?{" "}
                                        <span className="text-teal-300 hover:text-teal-500 font-bold">
                                          Registrate
                                        </span>
                                      </a>
                                    </Link>
                                  </div>
                                </div>
                              )}
                            </Menu.Item>
                          </Menu.Items>
                        </Transition>
                      </>
                    )}
                  </Menu>
                </div>
              )}
            </div>
          </div>

          <Transition isOpen={open}>
            <Disclosure.Panel className="sm:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link href="/">
                  <a
                    className="block bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-400 px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => close()}
                  >
                    Inicio
                  </a>
                </Link>
                <Menu
                  as="div"
                  className="relative z-2 block bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-400 rounded-md text-base font-medium w-full"
                >
                  {({ open }) => (
                    <>
                      <div>
                        <Menu.Button className="flex w-full">
                          <a className="w-full px-3 py-2 text-left">
                            Servicios
                          </a>
                        </Menu.Button>
                      </div>
                      <Transition isOpen={open}>
                        <Menu.Items
                          static
                          className="origin-top absolute left-0 mt-1 rounded-md shadow-lg py-1 bg-gray-200 ring-1 ring-black ring-opacity-5 focus:outline-none z-1 w-full"
                        >
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                className={
                                  (active && "bg-gray-300") +
                                  " cursor-pointer block px-4 py-2 text-sm text-gray-500"
                                }
                                onClick={() => close()}
                              >
                                Servicios - Dropdown móvil 1
                              </a>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </>
                  )}
                </Menu>
              </div>
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
};

export default index;