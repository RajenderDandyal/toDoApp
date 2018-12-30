import {createStore, applyMiddleware} from 'redux'
import {persistStore, persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web and AsyncStorage for react-native
import promiseMiddleware from 'redux-promise';
import rootReducer from '../reducers/toDoReducers'
import {AsyncStorage} from "react-native";

const initialState = {};
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};
const composeEnhancers = process.env.NODE_ENV === 'development' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : null || compose;

const persistedReducer = persistReducer(persistConfig, rootReducer)

export default () => {
  let store = createStore(persistedReducer, initialState, composeEnhancers(
      applyMiddleware(promiseMiddleware)
  ));
  let persistor = persistStore(store)
  return {store, persistor}
}