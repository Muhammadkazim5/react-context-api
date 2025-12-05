import type { IPost } from "../interfaces/post";
import http from "../utils/http";

export const login = (payload: IPost) => {
  return http.get('/post?page=1&limit=10');
};
