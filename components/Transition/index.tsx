import { Transition as TransitionComponent } from "@headlessui/react";
import React, { Fragment } from "react";

const Transition = ({
  children,
  isOpen,
  type = "default",
}: {
  children: JSX.Element;
  isOpen: boolean;
  type?: "default" | "tab";
}) => {
  return (
    <TransitionComponent
      show={isOpen}
      as={Fragment}
      {...(type === "default"
        ? {
            enter: "transition ease-out duration-100",
            enterFrom: "transform opacity-0 scale-95",
            enterTo: "transform opacity-100 scale-100",
            leave: "transition ease-in duration-75",
            leaveFrom: "transform opacity-100 scale-100",
            leaveTo: "transform opacity-0 scale-95",
          }
        : {
            enter: "transition ease-in-out duration-700 transform order-first",
            enterFrom: "transform opacity-0 translate-y-16",
            enterTo: "transform opacity-100 translate-y-0",
            leave: "transition ease-in-out duration-300 transform",
            leaveFrom: "transform opacity-100 translate-y-0",
            leaveTo: "transform opacity-0 -translate-y-16",
          })}
    >
      {children}
    </TransitionComponent>
  );
};

export default React.memo(Transition, (prev, next) => {
  return !(
    prev.children.key !== next.children.key ||
    prev.children.props.children.length !==
      next.children.props.children.length ||
    prev.children.type !== next.children.type ||
    prev.isOpen !== next.isOpen
  );
});
