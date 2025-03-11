import { applyMiddleware, compose, createStore } from "redux";
import reactDocReducer from "./reducer";
import { thunk } from "redux-thunk";
import { devToolsEnhancer } from "@redux-devtools/extension";

const middlewareEnhancer = applyMiddleware(thunk);
const composedEnhancer = compose(middlewareEnhancer, devToolsEnhancer())
const store = createStore(reactDocReducer, composedEnhancer);
export default store;