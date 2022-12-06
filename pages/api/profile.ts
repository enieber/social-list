import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import * as jose from "jose";
import fs from "fs";
import prisma from "../../lib/prisma";

const saltRounds = 10;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { bio, image, alt_image } = req.body;
    const requestHeaders = new Headers(req.headers as any);
    const [_, jwt] = requestHeaders.get("authorization").split(" ");
    const val = Buffer.from(jwt.split(".")[1], "base64").toString("ascii");
    const id = JSON.parse(val).sub;

    const profile = await prisma.profile.upsert({
      where: {
        userId: id,
      },
      create: {
        bio,
        image,
        altImage: alt_image,
        user: {
          connect: {
            id,
          },
        },
      },
      update: {
        bio,
        image,
        altImage: alt_image,
        user: {
          connect: {
            id,
          },
        },
      },
    });

    return res.status(200).json({
      ...profile,
    });
  }
  return res.status(405).json({ message: "method not allowed" });
}
