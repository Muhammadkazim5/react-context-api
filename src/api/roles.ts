import http from "../utils/http";

export const getRoles = (payload: {
  page: number;
  pageSize: number;
  id: string;
  name: string;
  description: string;
  createdAt: string;
}) => {
  return http.get(`/roles?page=${payload?.page}&limit=${payload?.pageSize}&id=${payload?.id}&name=${payload?.name}&description=${payload?.description}&createdAt=${payload?.createdAt}`);
};