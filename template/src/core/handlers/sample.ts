import { API } from "@/config/api";
import {
  creatingSampleSchema,
  creatingSampleType,
} from "@/core/models/sample/create";
import {
  updatingSampleSchema,
  updatingSampleType,
} from "@/core/models/sample/update";
import { requestingSampleType } from "@/core/models/sample/request";
import { AxiosResponse } from "axios";

// GET
export async function getAllSample() {
  const response: AxiosResponse<requestingSampleType[]> =
    await API.get("/samples"); // change this line to the correct endpoint
  return response.data;
}

// POST
export async function createSample(data: creatingSampleType) {
  creatingSampleSchema.parse(data);

  const payload = {
    ...data,
    price: Number(data.price.replace(/[^0-9]/g, "")),
  };

  const response: AxiosResponse<requestingSampleType> = await API.post(
    "/samples", // change this line to the correct endpoint
    payload,
  );

  return response.data;
}

// PUT
export async function updateSample(data: updatingSampleType) {
  updatingSampleSchema.parse(data);

  const payload = {
    ...data,
    price: Number(data.price.replace(/[^0-9]/g, "")),
  };

  const response: AxiosResponse<requestingSampleType> = await API.put(
    `/samples`, // change this line to the correct endpoint
    payload,
  );

  return response.data;
}

// DELETE
export async function deleteSample(id: string) {
  const response: AxiosResponse<string> = await API.delete(
    `/samples/${id}`, // change this line to the correct endpoint
  );
  return id;
}

// DELETE ALL
export async function deleteAllSample(ids: string[]) {
  if (ids.length == 0) return [];
  ids.forEach(async (id) => await API.delete(`/samples/${id}`));
  return ids;
}
