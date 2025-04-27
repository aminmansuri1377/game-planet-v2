import { atom } from "recoil";

export interface BuyerLocation {
  latitude: number;
  longitude: number;
  address?: string;
  locationId?: number;
}

export const buyerLocationAtom = atom<BuyerLocation | null>({
  key: "buyerLocation",
  default: null,
});
