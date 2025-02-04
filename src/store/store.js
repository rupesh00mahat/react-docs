import { createStore } from "redux";
import reactDocReducer from "./reducer";

const store = createStore(reactDocReducer);
export default store;