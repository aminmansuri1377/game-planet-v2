import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const buyerLocationAtom = atom<{
  latitude: number;
  longitude: number;
} | null>({
  key: "buyerLocationAtom",
  default: null,
  effects_UNSTABLE: [persistAtom], // Persist the state
});
