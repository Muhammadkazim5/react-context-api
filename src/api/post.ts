import http from "../utils/http";

export const getPosts = () => {
  return http.get('/post?page=1&limit=10');
};
