import * as actionTypes from "./actionTypes";
import isEmpty from "lodash/isEmpty"
import { screenNames, componentIds } from "../../screens";

export const addToDo = data => {
  return {
    type: actionTypes.ADD_TODO,
    payload: !isEmpty(data) ? data : []
  };
};
export const addToDo1 = data => {
  return {
    type: actionTypes.ADD_TODO,
    payload: !isEmpty(data) ? data : []
  };
};

export const updateToDo = data => {
  return {
    type: actionTypes.UPDATE_TODO,
    payload:  data
  };
};

