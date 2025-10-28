import axiosClient from "./axiosClient";

export const getAllTables =async ()=>{
    return await axiosClient.get("/tables");
}

export const createTable= async(payload)=>{
    return await axiosClient.post("/tables", payload);
}
export const deleteTable=async(id)=>{
    return await axiosClient.delete(`/tables/${id}`);
}

export const updateTableStatus = async (id, status) => {
  return await axiosClient.put(`/tables/${id}`, { isAvailable: status });
};