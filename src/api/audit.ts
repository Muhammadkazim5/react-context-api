import http from "../utils/http";

export const getAudits = (payload: { page: number; pagesize: number }) => {
  return http.get(`/audit?page=${payload.page}&limit=${payload.pagesize}`);
};
