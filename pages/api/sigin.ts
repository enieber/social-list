import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import * as jose from "jose";
import prisma from "../../lib/prisma";

const saltRounds = 10;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "need params in request",
      });
    }
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      const metchPassword = await bcrypt.compare(password, user.password);
      if (metchPassword) {
        const alg = "HS256";
        const secret = new TextEncoder().encode(process.env.SECRET_KEY);

        const jwt = await new jose.SignJWT({
          "urn:supplist:claim": true,
        })
          .setProtectedHeader({ alg })
          .setIssuedAt()
          .setIssuer("urn:supplist:api")
          .setAudience("urn:supplist:app")
          .setExpirationTime("2h")
          .setSubject(user.id)
          .sign(secret);

        return res.status(200).json({
          token: jwt,
        });
      }
    }
    return res.status(401).json({
      message: "invalid email or password",
    });
  }
  return res.status(405).json({ message: "method not allowed" });
}
