import { ChevronDoubleDownIcon } from "@heroicons/react/outline";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useLayoutEffect } from "react";
import { smoothScrollTo } from "../../../utils";
import ButtonWithIcon from "../../Button/ButtonWithIcon";
import FAQ from "./Sections/FAQ";
import Features from "./Sections/Features";
import FreeTrial from "./Sections/FreeTrial";
import Wave from "../Wave";

const index = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useLayoutEffect(() => {
    const moveBtnPricingOrb = () => {
      const btnPricing = document.querySelector(
        `[name="btn_pricing"]`
      ) as HTMLButtonElement;
      const btnPricingOrb = document.getElementById(
        "btn_pricing_orb"
      ) as HTMLDivElement;
      const btnPricingRect = btnPricing.getBoundingClientRect();
      btnPricingOrb.style.top = `${btnPricingRect.y + 10 + window.scrollY}px`;
      btnPricingOrb.style.left = `${btnPricingRect.x - 10}px`;
      btnPricingOrb.style.width = `${btnPricingRect.width}px`;
      btnPricingOrb.style.height = `${btnPricingRect.height}px`;
    };
    const moveFaqOrb = () => {
      const faqElement = document.getElementById(
        "faq_section"
      ) as HTMLDivElement;
      const faqOrb = document.getElementById("orbfaq") as HTMLDivElement;
      const faqRect = faqElement.getBoundingClientRect();
      faqOrb.style.top = `${faqRect.y + window.scrollY}px`;
    };
    const orbsPosition = () => {
      moveBtnPricingOrb();
      moveFaqOrb();
    };
    orbsPosition();
    window.addEventListener("resize", orbsPosition);

    let observer: IntersectionObserver;
    if (window.IntersectionObserver) {
      observer = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("animate-fade");
              (entry.target as HTMLElement).style.opacity = "1";
              observer.unobserve(entry.target);
            }
          });
        },
        {
          rootMargin: "-50px",
        }
      );
      document.querySelectorAll(".animate-on-scroll").forEach((element) => {
        (element as HTMLElement).style.opacity = "0";
        observer.observe(element);
      });
    }

    return () => {
      window.removeEventListener("resize", orbsPosition);
      if (observer) observer.disconnect();
    };
  }, []);

  return (
    <>
      <div className="animate-fadeorb">
        <div id="orbtop" className="orb" />
        <div id="orbfaq" className="orb right-24" />
        <div
          id="btn_pricing_orb"
          className="absolute bg-gradient-to-br from-teal-200 to-teal-600"
        />
      </div>
      <div className="absolute glass top-0 left-0 w-screen h-16" />
      <div className="glass min-h-screen">
        <div className="sm:flex w-full sm:min-h-[51rem] mb-2 sm:mb-0 p-5 animate-fade">
          <div className="sm:w-1/2 flex flex-col items-center justify-center p-4">
            <h1 className="font-bold text-[3.25rem] leading-none sm:text-6xl">
              Administra tu laboratorio en un solo lugar
            </h1>
            <p className="mt-2 text-justify">
              Un software de administración para laboratorio clínico de extremo
              a extremo: control de pagos y transformación de pruebas con los
              más altos estándares de seguridad, estés donde estés.
            </p>
            <div className="w-full flex justify-center my-4 items-center">
              <ButtonWithIcon
                text="Cotizar"
                className="py-3 px-8"
                name="btn_pricing"
                textClassName="ml-0"
                onClick={() =>
                  window.scrollTo({
                    behavior: "smooth",
                    top: document.body.scrollHeight,
                  })
                }
              >
                <></>
              </ButtonWithIcon>
              <Link href="/register">
                <span className="ml-6 text-teal-500 font-semibold cursor-pointer hover:text-teal-600">
                  Crea tu laboratorio
                </span>
              </Link>
            </div>
          </div>
          <div className="relative sm:w-1/2 min-h-[300px] sm:min-h-[unset]">
            <Image
              src="/pages/LandingPage/Product.png"
              alt="product"
              layout="fill"
              objectFit="contain"
              priority
              quality={100}
              className="sm:p-[3rem!important]"
            />
          </div>
        </div>
        <div className="absolute w-full animate-fade -translate-y-10 sm:translate-y-0">
          <span
            className="text-gray-500 hover:text-gray-400 font-semibold text-lg cursor-pointer"
            onClick={({ pageY }) => {
              // console.log({ e }); e.clientY, e.pageY, e.screenY
              // window.scrollTo({ behavior: "smooth", top: pageY });
              smoothScrollTo(0, pageY, 500);
            }}
          >
            ¿Qué hacemos?
            <ChevronDoubleDownIcon className="h-4 w-4 animate-bounce cursor-pointer absolute left-[calc(50%-8px)]" />
          </span>
        </div>
        <Wave className="animate-fade" />
        <Features />
        <FAQ />
        <FreeTrial />
      </div>
    </>
  );
};

export default dynamic(() => Promise.resolve(index), {
  ssr: false,
});
