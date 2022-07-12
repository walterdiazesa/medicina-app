import { showModal } from "../../components/Modal/showModal";
import { ResponseError, ResponseErrorData } from "../../types/Responses";

const dict: { [key: string]: { [msg: string]: string } } = {
  admin: {
    "Unauthorized operation":
      "Necesitas permisos de administrador para esta operación",
  },
  auth: {
    "Invalid auth": "Ningún usuario o laboratorio encontrado",
    "Unauthorized operation": "Necesitas estar logueado para esta operación",
  },
  redundant: {
    "User already a employee for this lab":
      "El usuario específicado ya es parte de este laboratorio",
  },
  preferences: {
    "Invalid leadingZerosWhenCustomId property > Outside bounds":
      "La propiedad sale fuera de los valores preestablecidos",
  },
  storage: {
    "Invalid image storage host": "Hosting de imágenes no permitido",
  },
  role: {
    "Not enough permissions for this action":
      "No tienes los suficientes permisos para realizar esta acción",
    "The requested validator doesn't have permissions for that test":
      "El validador solicitado no tiene permisos para validar este test",
    "Not a lab user": "No perteneces a ningún laboratorio",
    "Not a lab owner": "No eres dueño de ningún laboratorio",
    "Not a user from this lab": "No eres un usuario de este laboratorio",
    "No user profile for this account":
      "Esta cuenta es únicamente de laboratorio",
  },
  test: {
    "No test with requested params found":
      "Ningún test con los parametros solicitados encontrado",
  },
  hash: {
    "Not a valid access hash": "Token de acceso inválido",
  },
  invitation: {
    "Invalid invitation": "Invitación inválida",
    "The requested invitation already expired":
      "La invitación solicitada ya expiró",
  },
  identifier: {
    "In case you own many labs, you have to specify an identifier":
      "En caso que seas dueño de varios laboratorios, tienes que específicar un identificador",
  },
  deleted: {
    "Cannot update a already deleted test":
      "No se puede modificar un test ya eliminado",
  },
};

const getError = (key: string, msg: string, notUnique?: boolean) => {
  if (notUnique)
    return `Campo de "${msg.slice(msg.lastIndexOf("__") + 2)}" ya en uso`;
  if (key === "format") {
    if (msg.includes("__"))
      return `Formato de "${msg.slice(msg.lastIndexOf("__") + 2)}" inválido`;
    else `Formato inválido: ${msg}`;
  }
  if (key === "operation" && msg.includes("__")) {
    return `No se puede editar el ${msg.substring(
      msg.indexOf("__") + 2,
      msg.lastIndexOf("__")
    )} después de haber sido definido`;
  }
  if (msg === "Not found") return `"${key}" no encontrado`;
  if (dict.hasOwnProperty(key) && dict[key].hasOwnProperty(msg))
    return dict[key][msg];
  return `${key}: ${msg}`;
};

export const unexpectedError = ({ message, key, notUnique }: ResponseError) => {
  showModal({
    icon: "error",
    title: getError(key, message, notUnique),
    buttons: "OK",
    submitButtonText: "Entendido",
  });
};
