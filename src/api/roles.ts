import http from "../utils/http";

export const getRoles = (payload: {
  page: number;
  pageSize: number;
  id: number;
  name: string;
  description: string;
  createdAt: string;
}) => {
  return http.get(
    `/roles?page=${payload?.page}&limit=${payload?.pageSize}&id=${payload?.id}&name=${payload?.name}&description=${payload?.description}&createdAt=${payload?.createdAt}`
  );
};

export const getRoleById = (id: number) => {
  return http.get(`/roles/${id}`);
};

export const deleteRoleById = (id: number) => {
  return http.delete(`/roles/${id}`);
};

export const createRole = (data: { name: string; description: string }) => {
  return http.post("/roles", data);
};

export const updateRoleById = (
  id: number,
  data: { name: string; description: string }
) => {
  return http.put(`/roles/${id}`, data);
};
