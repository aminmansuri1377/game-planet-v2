import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const users = await prisma.user.findMany(); // Adjust to your model
    return res.status(200).json(users);
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
}
