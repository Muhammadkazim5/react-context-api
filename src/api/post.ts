import http from "../utils/http";

export const getPosts = (payload:{
  page: number;
  pagesize: number;
  name: string;
  id: number;
}) => {
  return http.get(`/post?page=${payload?.page}&limit=${payload?.pagesize}`);}

  export const createPost = (payload : {
    title : string ;
    content : string ;
    user : number
  }) => {
    return http.post(`/post`,payload)
  }
  export const getPostById = (id: number) => {
    return http.get(`/post/${id}`);
  };
  export const updatePost = (
    id: number,
    payload: { 
      title: string; 
      content: string; 
      user: number; 
    }
  ) => {
    return http.patch(`/post/${id}`, payload);
  };

  export const deletePost = (payload: {id: number}) => {
    return http.delete(`/post/${payload.id}`);
  }

 