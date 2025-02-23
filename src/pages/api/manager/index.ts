import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { phone } = req.body;

    // Validate the input
    if (!phone) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if the user already exists
    try {
      const existingUser = await prisma.manager.findUnique({
        where: { phone },
      });

      if (existingUser) {
        return res.status(400).json({ message: "User already exists." });
      }

      // Create the user
      const user = await prisma.manager.create({
        data: {
          phone,
        },
      });

      return res
        .status(201)
        .json({ message: "User created successfully", user });
    } catch (error) {
      console.error("Error creating user:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed." });
  }
}
