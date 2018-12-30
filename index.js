import {Navigation} from "react-native-navigation";

import themeConstants from "./src/theme";
import {componentIds, screenNames} from "./src/screens";
import {PersistGate} from 'redux-persist/integration/react'
import TodoList from "./src/screens/ToDo/ToDo";
import CommentsScreen from "./src/screens/ToDo/commentsScreen";
import {persistStore} from "redux-persist";
import {Provider} from "react-redux";
import store from "./src/store/createStore/createStore";
import React from "react";
import {AsyncStorage} from "react-native";
import {Platform, ActivityIndicator} from "react-native";


//let persistor = persistStore(store().store)

const TodoListWithStore = (props) => {
  return (
      <PersistGate loading={null} persistor={store().persistor}>
        <TodoList {...props}/>
      </PersistGate>
  );
};

const Loading = () => {
  return (
      <ActivityIndicator size={"large"} animating/>
  );
};
const CommentsScreenWithStore = (props) => {

  return (
      <Provider store={store().store}>
        <PersistGate loading={Loading()} persistor={store().persistor}>
          <CommentsScreen {...props}/>
        </PersistGate>
      </Provider>
  );


};
Navigation.registerComponentWithRedux(screenNames.toDo, () => TodoListWithStore, Provider, store().store);
Navigation.registerComponentWithRedux(screenNames.commentsScreen, () => CommentsScreenWithStore, Provider, store().store);
/* topBar: {
        visible: true,
        animate: true,
        hideOnScroll: true,
        buttonColor: themeConstants.pink800,
        backButton: {
          color: themeConstants.pink400
        },
        background: {
          color: themeConstants.primary
        },
        title: {
          color: themeConstants.offWhite,
          fontSize: 18,
          alignment: "center"
        }
        */

Navigation.setDefaultOptions({
  topBar: {
    title: {
      ...Platform.select({
        ios: {fontFamily: 'System',},
        android: {fontFamily: 'Roboto'}
      }),
      color: '#262626',
      alignment: 'center',
    },
    alignment: 'center',
    elevation: 0,
    noBorder: true,
    drawBehind: true,
    background: {
      color: 'transparent'
    }
  },
  statusBar: {
    visible: true,
    style: "light",
    backgroundColor: themeConstants.primary
  },
  layout: {
    backgroundColor: themeConstants.light,
    orientation: ["portrait"] //["portrait", "landscape"] An array of supported orientations
  },
  bottomTabs: {
    visible: true,
    animate: true, // Controls whether BottomTabs visibility changes should be animated
    backgroundColor: themeConstants.secondary
  },
  bottomTab: {
    iconColor: themeConstants.tertiary,
    selectedIconColor: themeConstants.pink400,
    textColor: themeConstants.tertiary,
    selectedTextColor: themeConstants.pink400,
    fontFamily: "Helvetica",
    fontSize: 10
  }
});

const stack = {
  children: [
    {
      component: {
        id: componentIds.toDoStack,
        name: screenNames.toDo,
        passProps: {}
      }
    }
  ],
  options: {}
};
Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      stack: stack
    }
  });
});

