import { atom } from "jotai";
import { responseUserSchemaType } from "@/core/models/user/request";

export const selectedUserRowAtom = atom<responseUserSchemaType | null>(null);
export const actionToPerformAtom = atom<"DELETE" | "EDIT" | null>(null);
