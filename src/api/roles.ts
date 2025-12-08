import http from "../utils/http";

export const getRoles = () => {
  return http.get('/roles?page=1&limit=10');
};