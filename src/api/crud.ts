import http from "../utils/http";

export const getCrud = (payload: {
  page: number;
  pagesize: number;
  name: string;
}) => {
  return http.get(`/crud?page=${payload?.page}&limit=${payload?.pagesize}`);
};
