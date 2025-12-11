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
export const createUser = (payload: any) => {
  // Send payload as-is. The UI will construct the shape the backend expects
  return http.post("/user", payload,
    {
    headers: { "Content-Type": "multipart/form-data" },
  }
  );
};

//................ DELETE User.............
export const deleteUser = (payload: { id: number }) => {
  return http.delete(`/user/${payload.id}`);
};

// .................get user................
export const viewUser = (id: number) => {
  return http.get(`/user/${id}`);
};

export const updateUser = (id: number, payload: FormData) => {
  return http.patch(`/user/${id}`, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};




