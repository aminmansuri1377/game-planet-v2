import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { userId, firstName, lastName, IDnumber } = req.body;

    try {
      const updatedBuyer = await prisma.buyer.update({
        where: { id: userId },
        data: { firstName, lastName, IDnumber },
      });

      res.status(200).json(updatedBuyer);
    } catch (error) {
      res.status(500).json({ message: "Failed to update buyer profile" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
