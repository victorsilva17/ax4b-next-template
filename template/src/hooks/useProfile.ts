// generate a custom hook to fetch the user profile from cookies using Cookie-js
import { responseUserSchemaType } from "@/core/models/user/request";
import Cookies from "js-cookie";

export function getUserSession(): responseUserSchemaType | null {
  const value = Cookies.get("userSession");
  return value ? JSON.parse(value) : null;
}
