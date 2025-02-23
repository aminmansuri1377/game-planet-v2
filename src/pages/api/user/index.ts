// import { NextApiRequest, NextApiResponse } from "next";
// import { PrismaClient } from "@prisma/client";
// import { hash } from "bcrypt";

// const prisma = new PrismaClient();

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method === "POST") {
//     const { username, email, password, role } = req.body;

//     // Validate the input
//     if (!username || !email || !password || !role) {
//       return res.status(400).json({ message: "All fields are required." });
//     }

//     // Check if the user already exists
//     try {
//       const existingUser = await prisma.user.findUnique({
//         where: { email },
//       });

//       if (existingUser) {
//         return res.status(400).json({ message: "User already exists." });
//       }

//       // Hash the password
//       const hashedPassword = await hash(password, 10);

//       // Create the user
//       const user = await prisma.user.create({
//         data: {
//           email,
//           name: username,
//           password: hashedPassword,
//           role: role || "BUYER", // Default to BUYER if no role is provided
//         },
//       });

//       return res
//         .status(201)
//         .json({ message: "User created successfully", user });
//     } catch (error) {
//       console.error("Error creating user:", error);
//       return res.status(500).json({ message: "Internal Server Error" });
//     }
//   } else {
//     return res.status(405).json({ message: "Method not allowed." });
//   }
// }
