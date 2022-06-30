/* eslint-disable react-hooks/rules-of-hooks */
import { Disclosure, Menu } from "@headlessui/react";
import {
  AtSymbolIcon,
  KeyIcon,
  LoginIcon,
  LogoutIcon,
  MenuIcon,
  OfficeBuildingIcon,
  SearchIcon,
  UserCircleIcon,
  UserIcon,
  XIcon,
} from "@heroicons/react/outline";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useEffect } from "react";
import { ButtonWithIcon, Transition } from "../..";
import Image from "next/image";
import { login, logout } from "../../../axios/Auth";
import { Auth } from "../../../types/Auth";
import { ResponseError } from "../../../types/Responses";
import { Informacion } from "./Item";
import { me } from "../../../axios/User";
import { showModal } from "../../Modal/showModal";

const index = ({
  isAuth,
  setAuth,
}: {
  isAuth: Auth;
  setAuth: React.Dispatch<React.SetStateAction<Auth>>;
}) => {
  const router = useRouter();

  const submitLoginForm = useCallback(
    async (form: HTMLFormElement): Promise<any> => {
      const formData = new FormData(form);
      if (!formData.has("username") || !formData.has("password"))
        return showModal({
          icon: "error",
          title: `No puedes dejar ningún campo vacío`,
          buttons: "OK",
          submitButtonText: "Entendido",
        });
      const username = formData.get("username")!.toString().trim();
      const password = formData.get("password")!.toString().trim();
      if (!username || !password)
        return showModal({
          icon: "error",
          title: `No puedes dejar ningún campo vacío`,
          buttons: "OK",
          submitButtonText: "Entendido",
        });
      const user = await login(username, password);
      if (user instanceof ResponseError) {
        // Clear, focus and red
        const [usernameInput, passwordInput] = form as any;
        form.reset();
        (usernameInput as HTMLInputElement).classList.remove("border-gray");
        (passwordInput as HTMLInputElement).classList.remove("border-gray");
        (usernameInput as HTMLInputElement).classList.add("border-red");
        (passwordInput as HTMLInputElement).classList.add("border-red");
        (usernameInput as HTMLInputElement).focus();
        return showModal({
          icon: "error",
          body: JSON.stringify(user),
          buttons: "OK",
          submitButtonText: "Entendido",
        }); // TODO: Show real message
      }
      setAuth(user);
    },
    [setAuth]
  );

  useEffect(() => {
    const debounce = (fn: (args: any[]) => void) => {
      let frame: number;
      return (...params: any[]) => {
        if (frame) {
          cancelAnimationFrame(frame);
        }
        frame = requestAnimationFrame(() => {
          // @ts-ignore
          fn(...params);
        });
      };
    };

    const storeScroll = () => {
      // document.documentElement.dataset.scroll = window.scrollY;
      const nav = document.getElementById("nav") as HTMLDivElement;
      if (window.scrollY === 0) {
        nav.classList.add("glass");
        nav.classList.remove("duration-500");
      } else {
        nav.classList.remove("glass");
        nav.classList.add("duration-500");
      }
    };

    if (router.pathname === "/") {
      document.addEventListener("scroll", debounce(storeScroll), {
        passive: true,
      });
      storeScroll();
    }

    return () => document.removeEventListener("scroll", debounce(storeScroll));
  }, [router.pathname]);

  return (
    <Disclosure
      id="nav"
      as="nav"
      className={`bg-white z-50 shadow-md fixed inset-0 bottom-auto duration-500 ${
        router.pathname === "/" && "glass"
      }`}
    >
      {({ open, close }) => (
        <>
          <div className="px-2 sm:px-6 lg:px-8">
            {/* <div className="relative flex items-center justify-between h-16"> TODO: Uncomment when sections */}
            <div className="relative flex items-center justify-end h-16">
              {/* <div className="absolute inset-y-0 left-0 flex items-center sm:hidden"> TODO: Uncomment when sections */}
              <div className="absolute inset-y-0 left-0 items-center hidden">
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-200">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              {/* <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start"> TODO: Uncomment when sections */}
              <div className="flex-1 items-center justify-center sm:items-stretch sm:justify-start hidden">
                <div className="hidden sm:block sm:ml-6">
                  <div className="flex space-x-4">
                    {router.pathname !== "/" && (
                      <Link href="/">
                        <a
                          className="bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-400 px-3 py-2 rounded-md text-sm font-semibold"
                          onClick={() => close()}
                        >
                          Inicio
                        </a>
                      </Link>
                    )}
                    <Menu as="div" className="relative">
                      {({ open }) => (
                        <>
                          <div>
                            <Menu.Button className="flex">
                              <a className="bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-400 px-3 py-2 rounded-md text-sm font-semibold">
                                Información
                              </a>
                            </Menu.Button>
                          </div>
                          <Transition isOpen={open}>
                            <Menu.Items
                              static
                              className="origin-top-left absolute left-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-gray-200 ring-1 ring-black ring-opacity-5 focus:outline-none 2xl:z-50"
                            >
                              <Informacion close={close} />
                            </Menu.Items>
                          </Transition>
                        </>
                      )}
                    </Menu>
                    <Link href="/pricing">
                      <a
                        className="bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-400 px-3 py-2 rounded-md text-sm font-semibold"
                        onClick={() => close()}
                      >
                        Precios
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
              {isAuth ? (
                <>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                    <p className="text-gray-500 hidden md:block">
                      {isAuth["sub"]}
                    </p>

                    <Menu as="div" className="ml-3 relative z-50">
                      {({ open }) => (
                        <>
                          <div>
                            <Menu.Button
                              className={`${
                                isAuth.img
                                  ? "ring-2 ring-offset-2 ring-offset-teal-500 ring-white bg-white"
                                  : "bg-gray-800"
                              } flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white`}
                            >
                              <span className="sr-only">Open user menu</span>
                              <Image
                                className="h-8 w-8 rounded-full"
                                src={
                                  isAuth.img ||
                                  `https://avatars.dicebear.com/api/jdenticon/${isAuth["sub"]}.svg`
                                }
                                alt="profile"
                                width={32}
                                height={32}
                                layout="fixed"
                                {...(isAuth.img && { objectFit: "scale-down" })}
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
                              {isAuth["sub-lab"].length && (
                                <Menu.Button as="div">
                                  <Link href="/lab">
                                    <a className="hover:bg-gray-200 cursor-pointer flex px-4 py-2 text-sm text-gray-500 items-center">
                                      <OfficeBuildingIcon className="w-4 h-4 mr-1.5" />
                                      <span className="transform translate-y-1.4px">
                                        Mi laboratorio
                                      </span>
                                    </a>
                                  </Link>
                                </Menu.Button>
                              )}
                              <Menu.Item>
                                <a
                                  className="hover:bg-gray-200 cursor-pointer flex px-4 py-2 text-sm text-gray-500 items-center"
                                  onClick={async () => {
                                    await logout();
                                    setAuth(null);
                                    router.replace("/");
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
                                <div
                                  className="px-4 py-2"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                  }}
                                >
                                  <form id="auth_form">
                                    <div className="block relative text-gray-400 focus-within:text-gray-600 w-full">
                                      <input
                                        type="text"
                                        name="username"
                                        className="py-1.5 text-sm text-gray-400 rounded-md pr-8 pl-3 border-2 border-gray focus:border-gray-600 focus:border-opacity-40 focus:outline-none bg-white focus:text-gray-600 w-full"
                                        placeholder="email, id o slug (lab o usuario)"
                                        autoComplete="off"
                                        onKeyDown={(e) => {
                                          if (e.code === "Tab")
                                            (
                                              document.getElementsByName(
                                                "password"
                                              )[0] as HTMLInputElement
                                            ).focus();
                                        }}
                                      />
                                      <span className="absolute inset-y-0 right-0 flex items-center pr-2">
                                        <AtSymbolIcon className="p-0.5 w-5 h-5 focus:outline-none focus:shadow-outline" />
                                      </span>
                                    </div>
                                    <div className="block relative text-gray-400 focus-within:text-gray-600 w-full my-2.5">
                                      <input
                                        type="password"
                                        name="password"
                                        className="py-1.5 text-sm text-gray-400 rounded-md pr-8 pl-3 border-2 border-gray focus:border-gray-600 focus:border-opacity-40 focus:outline-none bg-white focus:text-gray-600 w-full"
                                        placeholder="contraseña"
                                        autoComplete="off"
                                        onKeyDown={(e) => {
                                          if (e.code === "Enter") {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            (
                                              document.getElementsByName(
                                                "login_submit"
                                              )[0] as HTMLButtonElement
                                            ).click();
                                          }
                                        }}
                                      />
                                      <span className="absolute inset-y-0 right-0 flex items-center pr-2">
                                        <KeyIcon className="p-0.5 w-5 h-5 focus:outline-none focus:shadow-outline" />
                                      </span>
                                    </div>
                                    <ButtonWithIcon
                                      className="text-sm font-medium w-full px-6 py-1.5 justify-center"
                                      text="Ingresar"
                                      name="login_submit"
                                      onClick={() => {
                                        submitLoginForm(
                                          document.getElementById(
                                            "auth_form"
                                          ) as HTMLFormElement
                                        );
                                        /* (
                                          document.getElementById(
                                            "auth_form"
                                          ) as HTMLFormElement
                                        ).requestSubmit(); */
                                      }}
                                    >
                                      <LoginIcon
                                        className="w-5 h-5 text-white"
                                        aria-hidden="true"
                                      />
                                    </ButtonWithIcon>
                                  </form>
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
                {router.pathname !== "/" && (
                  <Link href="/">
                    <a
                      className="block bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-400 px-3 py-2 rounded-md text-base font-medium"
                      onClick={() => close()}
                    >
                      Inicio
                    </a>
                  </Link>
                )}
                <Menu
                  as="div"
                  className="relative z-2 block bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-400 rounded-md text-base font-medium w-full"
                >
                  {({ open }) => (
                    <>
                      <div>
                        <Menu.Button className="flex w-full">
                          <a className="w-full px-3 py-2 text-left">
                            Información
                          </a>
                        </Menu.Button>
                      </div>
                      <Transition isOpen={open}>
                        <Menu.Items
                          static
                          className="origin-top absolute left-0 mt-1 rounded-md shadow-lg py-1 bg-gray-200 ring-1 ring-black ring-opacity-5 focus:outline-none z-1 w-full"
                        >
                          <Informacion close={close} />
                        </Menu.Items>
                      </Transition>
                    </>
                  )}
                </Menu>
                <Link href="/pricing">
                  <a
                    className="block bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-400 px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => close()}
                  >
                    Precios
                  </a>
                </Link>
              </div>
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
};

export default index;
