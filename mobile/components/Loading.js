import React from 'react';
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

const Loading = () => <View style={styles.loading}>
  <Text style={styles.loadingText}>
    Loading...
  </Text>
</View>;

export default Loading;
