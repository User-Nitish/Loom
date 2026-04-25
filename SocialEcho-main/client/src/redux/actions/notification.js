import axios from "axios";
import * as actionTypes from "../constants/notification";

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL || "http://localhost:4000" });

API.interceptors.request.use((req) => {
  if (localStorage.getItem("profile")) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem("profile")).accessToken}`;
  }
  return req;
});

export const getNotifications = () => async (dispatch) => {
  try {
    const { data } = await API.get("/notifications");
    dispatch({ type: actionTypes.GET_NOTIFICATIONS, payload: data });
  } catch (error) {
    dispatch({ type: actionTypes.NOTIFICATION_ERROR, payload: error.message });
  }
};

export const markRead = (id) => async (dispatch) => {
  try {
    await API.patch(`/notifications/${id}/mark-read`);
    dispatch({ type: actionTypes.MARK_NOTIFICATION_READ, payload: id });
  } catch (error) {
    dispatch({ type: actionTypes.NOTIFICATION_ERROR, payload: error.message });
  }
};

export const markAllRead = () => async (dispatch) => {
  try {
    await API.patch("/notifications/mark-all-read");
    dispatch({ type: actionTypes.MARK_ALL_NOTIFICATIONS_READ });
  } catch (error) {
    dispatch({ type: actionTypes.NOTIFICATION_ERROR, payload: error.message });
  }
};
