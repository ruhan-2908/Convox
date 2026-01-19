import {create} from "zustand"

import toast from "react-hot-toast"

import { axiosInstance} from "../lib/axios.js";
import {useAuthStore} from "./useAuthStore.js";

export const useChatStore = create((set,get) => ({
    messages: [],
    users:[],
    selectedUser:null,
    isUsersLoading:false,
    isMessagesLoading:false,

    getUsers: async () => {
        set({isUsersLoading: true});
        try {
            const res = await axiosInstance.get("/messages/users");
            set({users: res.data});
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({isUsersLoading: false}); // fixed flag name
        }
    },

    getMessages: async (userId) => {
        set({isMessagesLoading:true});
        try
        {
            const res = await axiosInstance.get(`/messages/${userId}`);
            const normalized = res.data.map((m) => ({
                ...m,
                _id: m._id?.toString(),
                senderId: m.senderId?.toString(),
                receiverId: m.receiverId?.toString(),
            }));
            set({messages: normalized});
        }catch(error)
        {
            toast.error(error.response.data.message);
        }finally
        {
            set({isMessagesLoading: false});
        }
    },

    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        if (!selectedUser?._id) {
            toast.error("Select a user to chat first");
            return;
        }
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
            set({ selectedUser: {...selectedUser}, messages: [...messages, res.data] });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send message");
        }
    },

    subscribeToMessages: () => {
        const { selectedUser } = get();
        const socket = useAuthStore.getState().socket;
        const authUser = useAuthStore.getState().authUser;
        if (!selectedUser || !socket || !authUser || !socket.connected) return;

        // reset previous listener to avoid duplicates
        socket.off("newMessage");
        socket.on("newMessage", (newMessage) => {
            const isFromSelected = newMessage.senderId === selectedUser._id;
            const isToSelected = newMessage.receiverId === selectedUser._id;
            if (!isFromSelected && !isToSelected) return;

            set({ messages: [...get().messages, newMessage] });
        });
    },


    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    },

    setSelectedUser:(selectedUser) => set({selectedUser})
}));