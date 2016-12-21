import { createStore, combineReducers } from "redux";

export const rootReducer = createStore({});

export function configureStore(initialState) {
  const store = createStore(rootReducer);
  return store;
}
