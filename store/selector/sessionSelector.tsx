import { selector } from "recoil";
import { sessionAtom } from "../atoms/sessionAtom";

export const sessionSelector = selector({
  key: "sessionSelector",
  get: ({ get }) => get(sessionAtom),
});
