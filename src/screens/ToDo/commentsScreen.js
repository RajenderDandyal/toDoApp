import React, {Component} from 'react';
import {View, StyleSheet, Text, TextInput, TouchableOpacity} from "react-native";
import {connect} from "react-redux";
import isEmpty from "lodash/isEmpty";

import themeConstants from "../../theme";
import * as actionCreators from "../../store/actions";
import store from "../../store/createStore/createStore";

class CommentsScreen extends Component {
  state = {
    comment: "",
    item: ''
  };

  static options() {
    return {
      topBar: {
        title: {
          text: "Selected Task",
        }
      }
    };
  }

  changeTextHandler = (text) => {
    this.setState({comment: text});
  };

  addComment = () => {
    if (this.props.state.toDo) {
      if (this.props.state.toDo.length > 0) {
        let tasks = !isEmpty(this.props.state.toDo) ? this.props.state.toDo : [];

        console.log("add comment", tasks)
        let filteredTask = tasks.find(item => item.key === this.props.item.key);
        let commentArray = [{key: filteredTask.comments.length, text: this.state.comment}];
        filteredTask.comments = [...filteredTask.comments, ...commentArray];
        let newTasks = tasks.map((item) => {
          if (item.key === this.props.item.key) {
            return filteredTask
          } else {
            return item
          }
        });
        this.props.dispatch(actionCreators.addToDo(newTasks))

        this.setState({comment: ''})
      } else {
        store().persistor.persist()

      }
    }

  };
  handleCommentPress = (item, i) => {

    let tasks = this.props.state.toDo;
    console.log(tasks)
    let filteredTask = tasks.find(item => item.key === this.props.item.key);
    filteredTask.comments = filteredTask.comments.filter(item => item.key !== i);
    let newTasks = tasks.map((item) => {
      if (item.key === this.props.item.key) {
        return filteredTask
      } else {
        return item
      }
    });
    this.props.dispatch(actionCreators.addToDo(newTasks))
  };

  componentDidMount() {
    this.setState({item: this.props.item})
  }

  render() {
    let state = this.props.state;
    console.log("state comment", state)
    return (
        <View style={styles.container}>
          <View style={styles.toDo}>
            <Text style={styles.toDoText}>
              {this.state.item.text}
            </Text>
          </View>
          <TextInput
              style={styles.textInput}
              onChangeText={this.changeTextHandler}
              onSubmitEditing={this.addComment}
              value={this.state.comment}
              placeholder="Add comment"
              placeholderTextColor={themeConstants.offWhite}
              returnKeyType="done"
              returnKeyLabel="done"
          />
          {!isEmpty(this.props.state.toDo) ?
              this.props.state.toDo[this.props.item.key].comments.map((item, i) => <TouchableOpacity
                  key={i}
                  onPress={() => this.handleCommentPress(this.props.item, item.key)}>
                <View style={styles.comments}>
                  <Text style={styles.commentsText}>
                    {item.text}
                  </Text>
                </View>
              </TouchableOpacity>)
              : store().persistor.persist()
          }
        </View>
    );
  }
}

let mapStateToProps = (state) => {
  return {
    state: state,
    toDo: state.toDo
  }
};

export default connect(mapStateToProps)(CommentsScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40
  },
  toDo: {
    backgroundColor: themeConstants.secondary,
    padding: 10,
    margin: 10,
    borderRadius: 4
  },
  toDoText: {
    color: themeConstants.offWhite,
    fontSize: 28,
    fontWeight: "bold"
  },
  comments: {
    padding: 5,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10
  },
  commentsText: {
    color: themeConstants.primary,
    fontSize: 22,
    fontWeight: "bold"
  },
  textInput: {
    height: 40,
    paddingRight: 10,
    paddingLeft: 10,
    borderColor: "gray",
    width: "95%",
    borderRadius: 5,
    margin: 10,
    color: themeConstants.offWhite,
    backgroundColor: themeConstants.pink400
  }
});