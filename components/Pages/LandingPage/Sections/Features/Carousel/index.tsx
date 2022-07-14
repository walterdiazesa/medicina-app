import Image from "next/image";
import React from "react";
import Transition from "../../../../../Transition";

const index = ({
  tabs,
  tab,
}: {
  tabs: React.LegacyRef<HTMLDivElement> | undefined;
  tab: number;
}) => {
  return (
    <div
      className="sm:ml-4 max-w-xl md:max-w-none md:w-full mx-auto md:col-span-5 lg:col-span-6 mb-8 md:mb-0 md:order-1"
      data-aos="zoom-y-out"
      ref={tabs}
    >
      <div className="relative flex flex-row sm:flex-col text-center lg:text-right overflow-hidden sm:overflow-visible">
        {/* Item 1 */}
        <Transition isOpen={tab === 1} type="tab">
          <div className="sm:absolute inline-flex flex-row sm:flex-col md:max-w-none mx-auto rounded min-w-[calc(100vw-2rem)] sm:min-w-[unset]">
            <Image
              className=""
              src="/pages/LandingPage/Security.png"
              width="500"
              height="462"
              alt="security"
              objectFit="contain"
              priority
            />
          </div>
        </Transition>
        {/* Item 2 */}
        <Transition isOpen={tab === 2} type="tab">
          <div className="sm:absolute inline-flex flex-row sm:flex-col md:max-w-none mx-auto rounded min-w-[calc(100vw-2rem)] sm:min-w-[unset]">
            <Image
              className=""
              src="/pages/LandingPage/Cloud.png"
              width="500"
              height="462"
              alt="cloud"
              objectFit="contain"
              priority
            />
          </div>
        </Transition>
        {/* Item 3 */}
        <Transition isOpen={tab === 3} type="tab">
          <div className="sm:absolute inline-flex flex-row sm:flex-col md:max-w-none mx-auto rounded min-w-[calc(100vw-2rem)] sm:min-w-[unset]">
            <Image
              className=""
              src="/pages/LandingPage/App.png"
              width="500"
              height="462"
              alt="app"
              objectFit="contain"
              priority
            />
          </div>
        </Transition>
      </div>
    </div>
  );
};

export default React.memo(index, ({ tab }, { tab: nxTab }) => tab === nxTab);
