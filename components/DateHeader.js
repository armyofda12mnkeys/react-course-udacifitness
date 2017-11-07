import React from 'react';
import { Text } from 'react-native';
import moment from 'moment';

export default function DateHeader ({date}) {
  return (
    <Text>{moment(date).format("MM/DD/YYYY")}</Text>
  )
}