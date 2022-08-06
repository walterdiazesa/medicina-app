import {
  CakeIcon,
  IdentificationIcon,
  MailIcon,
  PhoneIcon,
  UserIcon,
} from "@heroicons/react/outline";
import React from "react";
import { Patient } from "../../../types/Prisma";

const index = ({ name, dui, sex, dateBorn, phone, email }: Patient) => {
  return (
    <div className="sm:flex items-center">
      <p className="mr-4">{name}</p>
      <p className="flex flex-row sm:flex-col lg:flex-row items-center mr-4">
        <IdentificationIcon className="h-5 w-5 text-gray-600" />
        <span className="md:hidden lg:inline mr-1">:</span>
        {dui}
      </p>
      <p className="flex flex-row sm:flex-col lg:flex-row items-center mr-4">
        <UserIcon className="h-5 w-5 text-gray-600" />
        <span className="md:hidden lg:inline mr-1">:</span>
        {sex}
      </p>
      <p className="flex flex-row sm:flex-col lg:flex-row items-center mr-4">
        <CakeIcon className="h-5 w-5 text-gray-600" />
        <span className="md:hidden lg:inline mr-1">:</span>
        {new Date(dateBorn).toLocaleDateString()}
      </p>
      <p className="flex flex-row sm:flex-col lg:flex-row items-center mr-4">
        <PhoneIcon className="h-5 w-5 text-gray-600" />
        <span className="md:hidden lg:inline mr-1">:</span>
        {phone}
      </p>
      <p className="flex flex-row sm:flex-col lg:flex-row items-center mr-4">
        <MailIcon className="h-5 w-5 text-gray-600" />
        <span className="md:hidden lg:inline mr-1">:</span>
        {email}
      </p>
    </div>
  );
};

export default index;
