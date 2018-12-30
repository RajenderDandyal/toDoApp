import * as actionTypes from "./actionTypes";
import isEmpty from "lodash/isEmpty";

export const addToDo = data => {
  return {
    type: actionTypes.ADD_TODO,
    payload: !isEmpty(data) ? data : []
  };
};