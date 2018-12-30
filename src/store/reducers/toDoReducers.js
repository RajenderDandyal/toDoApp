import * as actionTypes from '../actions/actionTypes';

const initialState = {
  loading:false,
  toDo:[]
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.TOOGLE_LOADING:
      return {
        ...state,
      };
    case actionTypes.ADD_TODO:
      return {
        ...state,
        toDo: [...action.payload]//console.log('inside reducer', action.payload)//
      };
    default:
      return state;
  }
};
