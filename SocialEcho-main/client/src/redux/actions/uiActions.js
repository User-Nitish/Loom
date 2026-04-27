import { OPEN_CREATE_POST_MODAL, CLOSE_CREATE_POST_MODAL } from "../reducers/ui";

export const openCreatePostModalAction = () => ({
  type: OPEN_CREATE_POST_MODAL,
});

export const closeCreatePostModalAction = () => ({
  type: CLOSE_CREATE_POST_MODAL,
});
