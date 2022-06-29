import React from "react";
import Modal from ".";

async function closeModal(modal: HTMLDivElement) {
  modal.classList.replace("opacity-100", "opacity-0");
  (document.getElementById("blurLayoutModal") as any).style.filter = "";
  await new Promise((resolve) =>
    setTimeout(() => {
      document.getElementById("mainLayout")?.removeChild(modal);
      document.getElementsByTagName("html")[0].style.overflow = "visible";
      document.body.style.touchAction = "pan-x pan-y";
      resolve(true);
      /* document.ontouchstart = (e) => undefined;
      document.body.style.overflow = "visible";
      document.body.style.position = ""; */
    }, 200)
  );
}

function layout() {
  //if (/iPad|iPhone|iPod/.test(navigator.userAgent))
  const modal = document.createElement("div");
  modal.id = "modalLayout";
  document.getElementsByTagName("html")[0].style.overflow = "hidden";
  document.body.style.touchAction = "none";
  /* document.ontouchstart = (e) => e.preventDefault();
  document.body.style.overflow = "hidden";
  document.body.style.position = "fixed"; */
  modal.className =
    "w-screen h-screen absolute z-50 inset-0 transition-opacity duration-200 ease-linear bg-gray-700 bg-opacity-60 opacity-0";
  modal.style.marginTop = `${window.scrollY}px`;
  //modal.style.minHeight = "100vh";
  modal.style.height = "calc(100vh + 1px)";
  window.onresize = () => {
    modal.style.marginTop = `${window.scrollY}px`;
  };
  modal.onclick = () => {
    closeModal(modal);
  };
  document.getElementById("mainLayout")?.appendChild(modal);
  (document.getElementById("blurLayoutModal") as any).style.filter =
    "blur(3px)";
  setTimeout(() => modal.classList.replace("opacity-0", "opacity-100"), 0);

  /* const text = document.createElement("p");
  text.innerHTML = "dwiawajniodwanidwawawad";
  text.className = "w-full h-36 bg-red-500 text-3xl font-bold text-white";
  text.onclick = (e) => e.stopPropagation();
  modal.appendChild(text); */
  return modal;
}

export function showModal({
  icon,
  title,
  body,
  buttons,
  submitButtonText,
  timer,
  dismissable = !timer,
}: {
  icon?: "warning" | "info" | "error" | "success" | "question";
  title?: string;
  body?: string;
  buttons?: "OK" | "Submit" | "Delete";
  submitButtonText?: string;
  timer?: number;
  dismissable?: boolean;
}) {
  return new Promise<boolean | undefined>((callback) => {
    // Modals Container
    const _layout = layout();

    _layout.onclick = async () => {
      if (dismissable) {
        await closeModal(_layout);
        callback(undefined);
      }
    };

    // Modal Layout
    const modalLayout = document.createElement("div");
    modalLayout.className = "fixed z-10 inset-0 overflow-y-auto";
    modalLayout.setAttribute("aria-labelledby", "modal-title");
    modalLayout.setAttribute("role", "dialog");
    modalLayout.ariaModal = "true";
    _layout.appendChild(modalLayout);

    // Modal Overlay
    const modalOverlay = document.createElement("div");
    modalOverlay.className =
      "flex items-center justify-center min-h-screen mx-3 sm:mx-0 text-center sm:block sm:p-0";
    modalLayout.appendChild(modalOverlay);

    // Modal Header
    const modalHeader = document.createElement("div");
    modalHeader.className =
      "fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity";
    modalHeader.ariaHidden = "true";
    modalOverlay.appendChild(modalHeader);

    // Modal HelperCenter
    const modalHelperCenter = document.createElement("span");
    modalHelperCenter.className =
      "hidden sm:inline-block sm:align-middle sm:h-screen";
    modalHelperCenter.ariaHidden = "true";
    modalHelperCenter.innerHTML = "&#8203;";
    modalOverlay.appendChild(modalHelperCenter);

    // Modal Body
    const modalBody = document.createElement("div");
    modalBody.className =
      "inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full sm:max-w-lg";
    modalBody.onclick = (e) => e.stopPropagation();
    modalOverlay.appendChild(modalBody);

    // Modal Content
    const modalContent = document.createElement("div");
    modalContent.className = `bg-white px-4 ${
      icon ? `${!body && buttons ? "pb-0" : "sm:py-4"} pt-5 pb-4` : "py-4"
    } ${(icon || body) && "sm:px-6"}`;
    modalBody.appendChild(modalContent);

    // Modal Content - Body
    const modalContentBody = document.createElement("div");
    modalContentBody.className = `sm:flex ${
      title && !body ? "items-center" : "sm:items-start"
    }`;
    modalContent.appendChild(modalContentBody);

    if (icon) {
      const modalContentBodyContainer = document.createElement("div");
      modalContentBodyContainer.className = `mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${
        icon === "error"
          ? "bg-red-100"
          : icon === "info"
          ? "bg-blue-50"
          : icon === "question"
          ? "bg-indigo-50"
          : icon === "success"
          ? "bg-teal-50"
          : "bg-yellow-50"
      } sm:mx-0 sm:h-10 sm:w-10`;
      modalContentBody.appendChild(modalContentBodyContainer);

      const modalIcon = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
      );
      modalIcon.classList.add(
        "h-6",
        "w-6",
        icon === "error"
          ? "text-red-600"
          : icon === "info"
          ? "text-blue-400"
          : icon === "question"
          ? "text-indigo-600"
          : icon === "success"
          ? "text-teal-700"
          : "text-yellow-700"
      );
      modalIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      modalIcon.setAttribute("fill", "none");
      modalIcon.setAttribute("viewBox", "0 0 24 24");
      modalIcon.setAttribute("stroke", "currentColor");
      modalIcon.setAttribute("aria-hidden", "true");
      const modalIconPath = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      modalIconPath.setAttribute("stroke-linecap", "round");
      modalIconPath.setAttribute("stroke-linejoin", "round");
      modalIconPath.setAttribute("stroke-width", "2");

      modalIconPath.setAttribute(
        "d",
        icon === "error"
          ? "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          : icon === "info"
          ? "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          : icon === "question"
          ? "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          : icon === "success"
          ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          : "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      );
      modalIcon.appendChild(modalIconPath);
      modalContentBodyContainer.appendChild(modalIcon);
    }

    const modalContentBodyContainerText = document.createElement("div");
    modalContentBodyContainerText.className = `${
      (body || icon) && "mt-3"
    } text-center sm:mt-0 sm:ml-4 sm:text-left`;
    modalContentBody.appendChild(modalContentBodyContainerText);

    // Modal Title
    if (title) {
      const modalTitle = document.createElement("h3");
      modalTitle.className = "text-lg leading-6 font-semibold text-gray-900";
      modalTitle.id = "modal-title";
      modalTitle.innerHTML = title;
      modalContentBodyContainerText.appendChild(modalTitle);
    }
    // Modal Body
    if (body) {
      const modalBodyTextContainer = document.createElement("div");
      modalBodyTextContainer.className = "mt-2";
      modalContentBodyContainerText.appendChild(modalBodyTextContainer);
      const modalBodyText = document.createElement("p");
      modalBodyTextContainer.className = "text-sm text-gray-500";
      modalBodyText.innerHTML = body;
      modalContentBodyContainerText.appendChild(modalBodyText);
    }

    // Modal Options
    if (buttons) {
      // Modal Footer
      const modalFooter = document.createElement("div");
      modalFooter.className =
        "bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse";
      modalBody.appendChild(modalFooter);

      const buttonSubmit = document.createElement("button");
      buttonSubmit.type = "button";
      buttonSubmit.className = `w-full inline-flex justify-center ${
        !icon || (icon !== "error" && buttons !== "Delete")
          ? icon === "success" || !icon
            ? "bg-teal-500 hover:bg-teal-400 border-teal-700 hover:border-teal-500"
            : icon === "info"
            ? "bg-blue-500 hover:bg-blue-400 border-blue-700 hover:border-blue-500"
            : icon === "question"
            ? "bg-indigo-500 hover:bg-indigo-400 border-indigo-700 hover:border-indigo-500"
            : "bg-yellow-600 hover:bg-yellow-700 border-yellow-700 hover:border-yellow-600"
          : buttons === "OK"
          ? "bg-gray-300 hover:bg-gray-400 border-gray-400 hover:border-gray-500"
          : "bg-red-500 hover:bg-red-400 border-red-700 hover:border-red-500"
      } text-white font-bold border-b-4 rounded px-4 py-2 sm:ml-3 sm:w-auto sm:text-sm`;
      buttonSubmit.innerText = submitButtonText || "Submit";
      buttonSubmit.onclick = async () => {
        await closeModal(_layout);
        callback(true);
      };
      modalFooter.appendChild(buttonSubmit);
      if (buttons !== "OK") {
        const buttonCancel = document.createElement("button");
        buttonCancel.type = "button";
        buttonCancel.className =
          "mt-3 sm:mt-0 w-full inline-flex justify-center bg-gray-300 hover:bg-gray-400 text-white font-medium border-b-4 border-gray-400 hover:border-gray-500 rounded px-4 py-2 sm:ml-3 sm:w-auto sm:text-sm";
        buttonCancel.innerText = "Cancelar";
        buttonCancel.onclick = async () => {
          await closeModal(_layout);
          callback(false);
        };
        modalFooter.appendChild(buttonCancel);
      }
    }

    if (timer) {
      setTimeout(async () => await closeModal(_layout), timer);
    }
  });
}
