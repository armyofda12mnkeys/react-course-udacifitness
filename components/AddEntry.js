import React, { Component } from 'react';
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
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

function SubmitBtn ({onPress}) {
  return (
    <TouchableOpacity
      onPress={onPress}
    >
      <Text>SUBMIT</Text>
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
    
    //update DB
    removeEntry({key})
  }
  render() {
    const metaInfo = getMetricMetaInfo();
    
    if( this.props.alreadyLogged ) { //if( true ) {
      return (
        <View>
          <Ionicons 
            name='ios-happy-outline' size={100}
          />
          <Text>You already logged your info for today</Text>
          <TextButton onPress={this.reset}>Reset</TextButton>
        </View>
      )      
    }
    
    
    
    return (
      <ScrollView>
        <Text>{JSON.stringify(this.state)}</Text>
        <DateHeader date={new Date()} />
        {Object.keys(metaInfo).map((key) => {
          const {getIcon, type, ...rest } = metaInfo[key];
          const value = this.state[key];
          //console.log('key',key);
          //console.log('type',type);
          //console.log('rest',rest);
          //console.log('value',value);
          
          return (
            <View key={key}>
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