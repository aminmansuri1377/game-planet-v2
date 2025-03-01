import { selector } from "recoil";
import { buyerLocationAtom } from "../atoms/buyerLocationAtom";

export const buyerLocationSelector = selector({
  key: "buyerLocationSelector",
  get: ({ get }) => get(buyerLocationAtom),
  set: ({ set }, newValue) => set(buyerLocationAtom, newValue),
});
