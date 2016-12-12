import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  loadingText: {
    fontSize: 30
  }
});

export default () => <View style={styles.loading}>
  <Text style={styles.loadingText}>
    Loading...
  </Text>
</View>;
