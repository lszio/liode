import { atom } from "nanostores";

export const $user = atom<any>(null);
export const $session = atom<any>(null);
export const $menuFolded = atom<boolean>(localStorage.getItem("menu-folded") === "t" ? true : false);
