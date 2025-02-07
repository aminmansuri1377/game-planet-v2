import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const sessionAtom = atom({
  key: "sessionAtom",
  default: null,
  effects_UNSTABLE: [persistAtom],
});
