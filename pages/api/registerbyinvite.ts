import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import { getError } from "../../utils/Error";

const emailPublicRsaDecrypt = (encryptedData: string) => {
  try {
    return crypto
      .publicDecrypt(
        process.env.PUBLIC_EMAIL_RSA_KEY!.trim(),
        Buffer.from(encryptedData, "hex")
      )
      .toString();
  } catch (e) {
    console.error("api/registerbyinvite/emailPublicRsaEncrypt", e);
    return null;
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const decrypted = emailPublicRsaDecrypt(req.body.hash);
  if (!decrypted)
    return res
      .status(400)
      .send({ error: getError("invitation", "Invalid invitation") });
  const {
    email,
    expires,
    labId,
  }: {
    email: string;
    expires: number;
    labId: string;
  } = JSON.parse(decrypted);

  /* if (expires < Date.now())
    return res.status(410).send({
      error: getError("invitation", "The requested invitation already expired"),
    }); */

  return res.send({ email, labId });
}
