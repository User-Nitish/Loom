export const OPEN_CREATE_POST_MODAL = "OPEN_CREATE_POST_MODAL";
export const CLOSE_CREATE_POST_MODAL = "CLOSE_CREATE_POST_MODAL";

const initialState = {
  isCreatePostModalOpen: false,
};

const uiReducer = (state = initialState, action) => {
  switch (action.type) {
    case OPEN_CREATE_POST_MODAL:
      return {
        ...state,
        isCreatePostModalOpen: true,
      };
    case CLOSE_CREATE_POST_MODAL:
      return {
        ...state,
        isCreatePostModalOpen: false,
      };
    default:
      return state;
  }
};

export default uiReducer;
