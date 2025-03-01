import { Buyer, Seller } from "@prisma/client";

export function isProfileComplete(user: Buyer | Seller): boolean {
  return !!(user?.firstName && user?.lastName && user?.IDnumber);
}
