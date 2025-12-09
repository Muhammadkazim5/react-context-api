import http from "../utils/http";

export const getUsers = (payload:{
  page: Number;
  pagesize: number;
  id: number;
  name: String;

}) => {
  return http.get(`/user?page=${payload?.page}&limit=${payload?.pagesize}`);
};




export const createUser = (payload: {
  name: string;
  email: string;
  password: string;
 
 
}) => {
  return http.post("/user", {
    name: payload.name,
    email: payload.email,
    password: payload.password,
    
   
  });
};
