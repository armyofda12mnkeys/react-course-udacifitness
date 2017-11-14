import React, { Component } from 'react';
import { Text, View, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { getMetricMetaInfo, timeToString } from '../utils/helpers';
import UdaciSlider from './UdaciSlider';
import UdaciSteppers from './UdaciSteppers';
import DateHeader from './DateHeader';
import { Ionicons } from '@expo/vector-icons';
import TextButton from './TextButton';
import {submitEntry, removeEntry} from '../utils/api';
import {connect} from 'react-redux';
import {addEntry} from '../actions';
import {getDailyReminderValue} from '../utils/helpers';
import {white, purple} from '../utils/colors';
import {NavigationActions} from 'react-navigation';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: white,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    //justifyContent: 'center',
    alignItems: 'center'
  },
  center: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 30,
    marginRight: 30,    
  },
  iosSubmitBtn: {
    backgroundColor: purple,
    padding: 10,
    borderRadius: 7,
    height: 45,
    marginLeft: 40,
    marginRight: 40,
  },
  androidSubmitBtn: {
    backgroundColor: purple,
    padding: 10,
    borderRadius: 2,
    paddingLeft: 30,
    paddingRight: 30,
    height: 45,
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  submitBtnTxt: {
    color: white,
    fontSize: 22,
    textAlign: 'center',
  }
});
function SubmitBtn ({onPress}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={ Platform.OS==='ios' ? styles.iosSubmitBtn : styles.androidSubmitBtn }
    >
      <Text style={styles.submitBtnTxt}>SUBMIT</Text>
    </TouchableOpacity>
  );
}

class AddEntry extends React.Component {
  state = {
    run: 0,
    bike: 0,
    swim: 0,
    sleep: 0,
    eat: 0,
  }
  
  increment = (metric) => {
    const {max, step } = getMetricMetaInfo(metric);
    this.setState((state) => {
      const count = state[metric] + step;
      return {
        ...state,
        [metric]: (count > max) ? max : count
      }
    });
  }
  
  decrement = (metric) => {    
    this.setState((state) => {
      const count = state[metric] - getMetricMetaInfo(metric).step;
      return {
        ...state,
        // is agove needed since shallow state update?
        [metric]: (count < 0) ? 0 : count
      }
    });
  }
  
  slide = (metric, value) => {
    this.setState(() => ({
      [metric]: value
    }))
  }
  
  submit = () => {
    const key = timeToString();
    const entry = this.state;
    
    // Update Redux
    this.props.dispatch(addEntry({
      [key]: entry
    }));
    
    
    this.setState({
      run: 0,
      bike: 0,
      swim: 0,
      sleep: 0,
      eat: 0,
    });
    //Navigate to home
    this.toHome();
    
    //Save to DB
    submitEntry({key, entry})
    
    //Clear Local Notification
  }
  
  reset = () => {
    const key = timeToString();
    
    //update redux
    this.props.dispatch(addEntry({
      [key]: getDailyReminderValue()
    }));
    
    
    //route to home
    this.toHome();
    
    //update DB
    removeEntry(key);
  }
  toHome = () => {
    this.props.navigation.dispatch(NavigationActions.back({
      key: 'AddEntry'
    }))
    
  }
  render() {
    const metaInfo = getMetricMetaInfo();
    
    if( this.props.alreadyLogged ) { //if( true ) {
      return (
        <View style={styles.center}>
          <Ionicons 
            name={Platform.OS ==='ios' ? 'ios-happy-outline': 'md-happy'} size={100}
          />
          <Text>You already logged your info for today</Text>
          <TextButton style={{padding: 10}} onPress={this.reset}>Reset</TextButton>
        </View>
      )      
    }
    
    
    
    return (
      <ScrollView style={styles.container}>
        <DateHeader date={new Date().toLocaleString()} />
        {Object.keys(metaInfo).map((key) => {
          const {getIcon, type, ...rest } = metaInfo[key];
          const value = this.state[key];
          //console.log('key',key);
          //console.log('type',type);
          //console.log('rest',rest);
          //console.log('value',value);
          
          return (
            <View key={key} style={styles.row}>
              {getIcon()}
                {type === 'slider' 
                ?
                  <UdaciSlider 
                    value={value} 
                    onChange={(value) => this.slide(key, value)}
                    {...rest}
                  />
                :
                  <UdaciSteppers 
                    value={value} 
                    onIncrement={() => this.increment(key)}
                    onDecrement={() => this.decrement(key)}
                    {...rest}
                  />
                }
            </View>
            
          );
        })}
        <SubmitBtn onPress={this.submit} />
      </ScrollView>
    );
  }
}

function mapStateToProps (state) {
  const key = timeToString();
  
  return {
    alreadyLogged: state[key] && typeof state[key].today === 'undefined'
  }
}

export default connect(mapStateToProps)(AddEntry);

/*
<Text>{JSON.stringify(this.state)}</Text> 
*/