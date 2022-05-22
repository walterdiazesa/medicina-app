import { Transition as TransitionComponent } from "@headlessui/react";
import React, { Fragment } from "react";

const Transition = ({
  children,
  isOpen,
}: {
  children: JSX.Element;
  isOpen: boolean;
}) => {
  return (
    <TransitionComponent
      show={isOpen}
      as={Fragment}
      enter="transition ease-out duration-100"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-95"
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
