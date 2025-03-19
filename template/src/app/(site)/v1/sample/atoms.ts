import { atom } from "jotai";
import { requestingSampleType } from "@/core/models/sample/request";

export const selectedSampleRowAtom = atom<requestingSampleType | null>(null);
export const actionToPerformAtom = atom<"DELETE" | "EDIT" | null>(null);
