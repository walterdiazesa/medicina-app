/* eslint-disable react-hooks/rules-of-hooks */
import {
  PhoneIcon,
  ReceiptTaxIcon,
  ServerIcon,
} from "@heroicons/react/outline";
import React, { useMemo, useState } from "react";

const dictPricesByStep: {
  [step: number]: {
    curie: number;
    pasteur: number;
    fleming: number;
  };
} = {};

const index = ({
  chemPricingSteps,
  chemBasePricing,
}: {
  chemPricingSteps: {
    number: number;
    discount: number;
  }[];
  chemBasePricing: {
    curie: number;
    pasteur: number;
    fleming: number;
  };
}) => {
  const [priceStep, setPriceStep] = useState(1);

  const pricesByStep = useMemo(() => {
    if (dictPricesByStep.hasOwnProperty(priceStep))
      return dictPricesByStep[priceStep];
    const prices: typeof chemBasePricing = { curie: 0, fleming: 0, pasteur: 0 };
    for (let i = 0; i < Math.min(priceStep, chemPricingSteps.length); i++) {
      for (const plan of Object.keys(prices) as Array<keyof typeof prices>) {
        prices[plan] +=
          chemBasePricing[plan] * (1 - chemPricingSteps[i].discount / 100);
      }
    }
    dictPricesByStep[priceStep] = prices;
    return prices;
  }, [priceStep]);

  return (
    <>
      <div className="flex items-center justify-center">
        <ServerIcon className="text-white h-6 w-6 mr-2" />
        <div className="flex flex-col space-y-2 p-2 w-full sm:w-4/5">
          <input
            type="range"
            className="w-full bg-teal-100 appearance-none h-2 rounded-sm accent-teal-contrast"
            min={1}
            max={chemPricingSteps[chemPricingSteps.length - 1].number + 1}
            step={1}
            defaultValue={priceStep}
            onInput={(e) => setPriceStep(+(e.target as HTMLInputElement).value)}
          />
          <ul className="flex justify-between w-full px-[10px]">
            {chemPricingSteps.map((step) => (
              <li key={step.number} className="flex justify-center relative">
                {step.number === priceStep && (
                  <span className="absolute text-white flex items-center font-bold text-lg">
                    {step.number}
                    <ReceiptTaxIcon className="ml-1.5 h-5 w-5 text-teal-contrast font-normal text-base" />
                    <span className="ml-0.5 font-normal text-base text-teal-contrast">
                      {step.discount}%
                    </span>
                  </span>
                )}
              </li>
            ))}
            <li className="flex justify-center">
              {priceStep ===
                chemPricingSteps[chemPricingSteps.length - 1].number + 1 && (
                <span className="absolute text-white font-bold text-lg">
                  +{chemPricingSteps[chemPricingSteps.length - 1].number}
                  <div className="hidden sm:flex items-center justify-center -translate-y-2 cursor-pointer text-teal-contrast hover:text-teal-800">
                    <PhoneIcon className="h-4 min-w-4 font-normal text-base translate-y-px" />
                    <span className="ml-0.5 font-normal text-base">
                      Contacta con ventas
                    </span>
                  </div>
                </span>
              )}
            </li>
          </ul>
        </div>
      </div>
      <div
        className={`${
          priceStep < chemPricingSteps[chemPricingSteps.length - 1].number + 1
            ? "mt-10"
            : "mt-6"
        } sm:mt-12`}
      >
        {priceStep <
        chemPricingSteps[chemPricingSteps.length - 1].number + 1 ? (
          <div className="grid grid-flow-row sm:grid-cols-3 gap-4 w-full sm:w-4/5 mx-auto">
            <div className="bg-white rounded-md p-2 flex flex-col items-center justify-center">
              <p className="uppercase font-bold">Plan Curie</p>
              <p className="text-teal-contrast">
                ${pricesByStep.curie.toFixed(2)} / total / mes
              </p>
            </div>
            <div>
              <div className="rounded-t-md bg-teal-contrast flex text-white items-center justify-center py-2">
                <ReceiptTaxIcon className="text-white mr-2 h-5 w-5" />
                Mayor ahorro
              </div>
              <div className="bg-white p-2 rounded-b-md">
                <p className="uppercase font-bold">Plan Fleming</p>
                <p className="text-teal-contrast">
                  ${pricesByStep.fleming.toFixed(2)} / total / mes
                </p>
              </div>
            </div>
            <div className="bg-white rounded-md p-2 flex flex-col items-center justify-center">
              <p className="uppercase font-bold">Plan Pasteur</p>
              <p className="text-teal-contrast">
                ${pricesByStep.pasteur.toFixed(2)} / total / mes
              </p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <p className="text-justify">
              Tu laboratorio tiene necesidades específicas, te sugerimos{" "}
              <b className="text-teal-contrast hover:text-teal-900 cursor-pointer">
                contactar con ventas
              </b>{" "}
              para poderte hacer un plan adaptado a las medidas de tu
              laboratorio.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default React.memo(index, () => false);
