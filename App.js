import React from 'react';
import { View } from 'react-native';
//import { Ionicons } from '@expo/vector-icons';
import AddEntry from './components/AddEntry';
import History from './components/History';
import { Button, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, TouchableNativeFeedback, StyleSheet, Text, Slider } from 'react-native';
import { createStore } from 'redux';
import {Provider} from 'react-redux';
import reducer from './reducers';

export default class App extends React.Component {
  state = {
    value: 0
  }
  handlePress = () => {
    //alert('Hello!');
  }
  render() {
    return (
    <Provider store={createStore(reducer)}>
      <View style={{flex: 1}}>
        <View style={{height: 20 }} />
        <History />
        <AddEntry />

      </View>
    </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
/*
        <Text>App.js State: {this.state.value}</Text>
,
  btn: {
    backgroundColor: '#E53224',
    padding: 10,
    paddingLeft: 50,
    paddingRight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  btnText: {
    color: '#fff'
  }
*/