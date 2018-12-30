import React, {Component} from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  AsyncStorage,
  Button,
  TextInput,
  Keyboard,
  Platform,
  TouchableOpacity,
  AppState
} from "react-native";
import {connect} from "react-redux";
import PushNotification from 'react-native-push-notification';

import themeConstants from "../../theme";
import NavigateUser from "../../utils/navigationFunction";
import {componentIds, screenNames} from "../index";
import * as actionCreators from "../../store/actions";
import isEmpty from "lodash/isEmpty";
import LocalPushNotifications from "../../PushNotifications/LocalPushNotifications";


const isAndroid = Platform.OS === "android";
const viewPadding = 10;

class TodoList extends Component {
  state = {
    text: "",
    time: 5 * 1000
  };

  static options() {
    return {
      topBar: {
        title: {
          text: "To Do",
        }
      }
    };
  }

  changeTextHandler = text => {
    this.setState({text: text});
  };

  addTask = () => {
    let stateFromStore = this.props.state;
    if (!isEmpty(stateFromStore.toDo)) {
      let tasks = stateFromStore.toDo;
      tasks = tasks.concat({key: tasks.length, text: this.state.text, comments: []})
      this.props.dispatch(actionCreators.addToDo(tasks))
    } else {
      let tasks = [{key: 0, text: this.state.text, comments: []}];

      this.setState({text: ""}, () => this.props.dispatch(actionCreators.addToDo(tasks)))
    }
  };

  deleteTask = i => {
    let stateFromStore = this.props.state;
    let tasks = stateFromStore.toDo;
    tasks.splice(i, 1);
    this.props.dispatch(actionCreators.addToDo(tasks))
  };

  componentDidMount() {
    Keyboard.addListener(
        isAndroid ? "keyboardDidShow" : "keyboardWillShow",
        e => this.setState({viewPadding: e.endCoordinates.height + viewPadding})
    );

    Keyboard.addListener(
        isAndroid ? "keyboardDidHide" : "keyboardWillHide",
        () => this.setState({viewPadding: viewPadding})
    );
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  loadAddCommentScreen = (itemFromFlatList) => {
    let item = this.props.state.toDo.find(item => item.key === itemFromFlatList.key);
    let passProps = {
      item
    };
    NavigateUser(componentIds.toDoStack, screenNames.commentsScreen, passProps)
  };

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange = (appState) => {
    if (this.props.state.toDo.length) {
      if (appState === 'background') {
        let date = new Date(Date.now() + (this.state.time));

        if (Platform.OS === 'ios') {
          date = date.toISOString();
        }

        PushNotification.localNotificationSchedule({
          message: "You have some tasks to do",
          date,
        });
      }
    }
  }

  render() {
    console.log("state", this.state)
    console.log("store", this.props.state)
    return (
        <View
            style={[styles.container, {paddingBottom: this.state.viewPadding}]}
        >
          <FlatList
              style={styles.list}
              data={this.props.state.toDo}
              keyExtractor={(item) => `${item.text.toString() + Math.random()}`}
              renderItem={({item, index}) =>
                  <TouchableOpacity onPress={() => this.loadAddCommentScreen(item)}>
                    <View style={styles.listItemCont}>
                      <View style={styles.textWrap}>
                        <Text numberOfLines={1} ellipsizeMode='tail' style={styles.listItem}>
                          {item.text}
                        </Text>
                      </View>
                      <View style={styles.btnWrap}>
                        <Button title="X" onPress={() => this.deleteTask(index)}/>
                      </View>
                    </View>
                  </TouchableOpacity>}
          />
          <TextInput
              style={styles.textInput}
              onChangeText={this.changeTextHandler}
              onSubmitEditing={this.addTask}
              value={this.state.text}
              placeholder="Add Tasks"
              placeholderTextColor={themeConstants.offWhite}
              returnKeyType="done"
              returnKeyLabel="done"
          />
          <LocalPushNotifications/>
        </View>
    );
  }
}

let mapStateToProps = state => {
  return {
    state: state
  }
};

export default connect(mapStateToProps)(TodoList)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: themeConstants.light,
    padding: viewPadding,
    paddingTop: 40
  },
  list: {
    width: "100%"
  },
  listItem: {
    paddingTop: 2,
    paddingBottom: 2,
    fontSize: 18
  },
  listItemCont: {
    margin: 5,
    padding: 10,
    borderRadius: 4,
    backgroundColor: themeConstants.secondary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  textWrap: {
    width: "90%"
  },
  btnWrap: {
    flex: 1,
    width: 30
  },
  textInput: {
    height: 40,
    paddingRight: 10,
    paddingLeft: 10,
    borderColor: "gray",
    borderWidth: isAndroid ? 0 : 1,
    width: "100%",
    borderRadius: 5,
    color: themeConstants.offWhite,
    backgroundColor: themeConstants.pink400
  }
});
