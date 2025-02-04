export const INITIATE_DATA = "INITIATE_DATA";
export const UPDATE_DOCS = "UPDATE_DOCS";
export const LOGIN_USER = "LOGIN_USER";

export const initiateData = (value) => ({
  type: INITIATE_DATA,
  payload: value,
});
export const loginuser = (value) => ({
  type: LOGIN_USER,
  payload: value,
});
export const updateDocs = (value) => ({
  type: UPDATE_DOCS,
  payload: value
})