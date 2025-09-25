import { axiosInstance } from "@/db/axios";
import { Users } from "@/types/data";
import toast from "react-hot-toast";
import { create } from "zustand";

// types
interface UserProps {
  users: Users[];
  isLoading: boolean;
  getUsers: (search_by_name?: string) => Promise<void>;
  deleteUser: (rank: number) => Promise<void>;
  addUser: (users: Omit<Users, "rank">) => Promise<Users>; // rank is auto-handled
}

export const useUsersStore = create<UserProps>((set) => ({
  users: [],
  isLoading: false,

  getUsers: async (search_by_name="") => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(`/?search_by_name=${search_by_name}`);
      set({ users: res.data.data });
      toast.success("Users fetched successfully");
    } catch (error: unknown) {
      console.error("Error fetching users:", error);
      toast.error(`SERVER ERROR: ${error}`);
    } finally {
      set({ isLoading: false });
    }
  },

  deleteUser: async (rank: number) => {
    set({ isLoading: true });
    try {
      await axiosInstance.delete(`/?id=${rank}`);
      set((state) => ({
        users: state.users.filter((user) => parseInt(user.rank) !== rank),
      }));
      toast.success("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(`SERVER ERROR: ${error}`);
    } finally {
      set({ isLoading: false });
    }
  },

  addUser: async (user) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.post("/", user);
console.log(res.data.data);
      // update local store after successful add
      set((state) => ({
        users: [...state.users, res.data.data], // assuming backend returns added user
      }));

      toast.success("User added successfully");
      return res.data.data;
    } catch (error) {
      console.error("Error adding user:", error);
      toast.error(`SERVER ERROR: ${error}`);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));
