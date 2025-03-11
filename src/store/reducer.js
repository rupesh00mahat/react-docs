import { INITIATE_DATA, LOGIN_USER, UPDATE_DOCS } from "./actions";

const initialState = {
  emailId: "",
  uid: 0,
  documents: [],
};

const reactDocReducer = (state = initialState, action) => {
  switch (action.type) {
    case INITIATE_DATA:
      return { ...state, documents: action.payload.documents};
    case LOGIN_USER:
      return {
        ...state,
        uid: action.payload.uid,
        emailId: action.payload.email,
      };
    case UPDATE_DOCS: 
      return {
        ...state,
        documents: action.payload,
      }
    default:
      return state;
  }
};
export default reactDocReducer;