import http from "../utils/http";

export const getPosts = (payload:{
  page: Number;
  name: String;
  pagesize: Number;
  id: Number;
}) => {

  return http.get(`/post?page=${payload?.page}&limit=${payload?.pagesize}`);}