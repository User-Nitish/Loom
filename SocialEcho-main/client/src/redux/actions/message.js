import axios from "axios";
import * as actionTypes from "../constants/message";

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL || "http://localhost:4000" });

API.interceptors.request.use((req) => {
  if (localStorage.getItem("profile")) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem("profile")).accessToken}`;
  }
  return req;
});

export const getConversations = () => async (dispatch) => {
  try {
    dispatch({ type: actionTypes.START_LOADING_MESSAGES });
    const { data } = await API.get("/messages/conversations");
    dispatch({ type: actionTypes.GET_CONVERSATIONS, payload: data });
  } catch (error) {
    dispatch({ type: actionTypes.MESSAGING_ERROR, payload: error.message });
  }
};

export const getMessages = (conversationId) => async (dispatch) => {
  try {
    dispatch({ type: actionTypes.START_LOADING_MESSAGES });
    const { data } = await API.get(`/messages/${conversationId}`);
    dispatch({ type: actionTypes.GET_MESSAGES, payload: data });
  } catch (error) {
    dispatch({ type: actionTypes.MESSAGING_ERROR, payload: error.message });
  }
};

export const sendMessage = (messageData) => async (dispatch) => {
  try {
    const { data } = await API.post("/messages", messageData);
    dispatch({ type: actionTypes.SEND_MESSAGE, payload: data });
    return data;
  } catch (error) {
    dispatch({ type: actionTypes.MESSAGING_ERROR, payload: error.message });
  }
};

export const receiveMessage = (message) => ({
  type: actionTypes.RECEIVE_MESSAGE,
  payload: message
});
