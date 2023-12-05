import { atom } from "nanostores";

export const $inImmersionMode = atom<boolean>(
  localStorage.getItem("immersionModep") === "t" ? true : false
);
