import * as actionTypes from "../constants/message";

const initialState = {
  conversations: [],
  activeMessages: [],
  loading: false,
  error: null,
};

const messageReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.START_LOADING_MESSAGES:
      return { ...state, loading: true };
    case actionTypes.GET_CONVERSATIONS:
      return { ...state, conversations: action.payload, loading: false };
    case actionTypes.GET_MESSAGES:
      return { ...state, activeMessages: action.payload, loading: false };
    case actionTypes.SEND_MESSAGE:
      return { 
        ...state, 
        activeMessages: [...state.activeMessages, action.payload] 
      };
    case actionTypes.RECEIVE_MESSAGE:
      return { 
        ...state, 
        activeMessages: [...state.activeMessages, action.payload] 
      };
    case actionTypes.MESSAGING_ERROR:
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

export default messageReducer;
