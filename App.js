import React from 'react';
import { View, Platform, StatusBar } from 'react-native';
//import { Ionicons } from '@expo/vector-icons';
import AddEntry from './components/AddEntry';
import History from './components/History';
import { Button, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, TouchableNativeFeedback, StyleSheet, Text, Slider } from 'react-native';
import { createStore } from 'redux';
import {Provider} from 'react-redux';
import reducer from './reducers';
import {TabNavigator, StackNavigator} from 'react-navigation';
import {purple, white} from './utils/colors';
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import {Constants} from 'expo';
import EntryDetail from './components/EntryDetail';

function UdaciStatusBar({backgroundColor, ...props}) {
  return (
    <View style={{backgroundColor, height: Constants.statusBarHeight}}>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </View>
  );
}

const Tabs = TabNavigator({
  History: {
    screen: History,
    navigationOptions: {
      tabBarLabel: 'History',
      tabBarIcon: ({tintColor}) => <Ionicons name='ios-bookmarks' size={30} color={tintColor} />
    }
  },
  AddEntry: {
    screen: AddEntry,
    navigationOptions: {
      tabBarLabel: 'Add Entry',
      tabBarIcon: ({tintColor}) => <FontAwesome name='plus-square' size={30} color={tintColor} />
    }
  }
}, {
  navigationOptions: {
    header: null
  },
  tabBarOptions: {
    activeTintColor: Platform.OS==='ios' ? purple : white,
    style: {
      height: 56,
      backgroundColor:  Platform.OS==='ios' ? white : purple,
      shadowColor: 'rgba(0,0,0,0.24)',
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowRadius: 6,
      shadowOpacity: 1,
    }
  }
});

const MainNavigator = StackNavigator({
  Home: {
    screen: Tabs
  },
  EntryDetail: {
    screen: EntryDetail,
    navigationOptions: {
      headerTintColor: white,
      headerStyle: {
        backgroundColor: purple,        
      }
    }
  }
});

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
        <UdaciStatusBar backgroundColor={purple} barStyle='light-content' />
        <MainNavigator />

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