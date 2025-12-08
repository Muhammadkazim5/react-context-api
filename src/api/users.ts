import http from "../utils/http";

export const getUsers = () => {
  return http.get('/user?page=1&limit=10');
};