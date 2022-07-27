import Link from "next/link";
import React from "react";
import ButtonWithIcon from "../../../../Button/ButtonWithIcon";

const index = () => {
  return (
    <div id="freetrial_section" className="py-16 px-4 sm:px-0">
      <div className="animate-on-scroll sm:flex justify-center items-center">
        <h1 className="text-3xl sm:text-4xl font-semibold text-white">
          ¿Aún no estás seguro?
        </h1>
        <Link href="/pricing?campaign=SUMMERFREEMONTH">
          <ButtonWithIcon
            text="Prueba Flemik por 30 días gratis"
            className="sm:ml-8 py-2 sm:px-8 w-full justify-center sm:w-[unset] text-lg sm:text-xl bg-teal-contrast border-b-teal-700 hover:bg-teal-700 hover:border-b-teal-contrast mt-3 sm:mt-0"
            textClassName="ml-0"
          >
            <></>
          </ButtonWithIcon>
        </Link>
      </div>
    </div>
  );
};

export default index;
