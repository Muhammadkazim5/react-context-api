import http from "../utils/http";

export const getUsers = (payload: {
  page: number;
  pagesize: number;
  id?: number;
  name?: string;
}) => {
  return http.get(`/user?page=${payload.page}&limit=${payload.pagesize}`);
};



// ...............Create User...............
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

//................ DELETE User.............
export const deleteUser = (payload: { id: number }) => {
  return http.delete(`/user/${payload.id}`);
};
