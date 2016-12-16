import React from 'react';
import {AppRegistry} from 'react-native';
import ApolloClient, {createNetworkInterface} from 'apollo-client';
import {ApolloProvider} from 'react-apollo';
import Scene from './components/Scene';

const networkInterface = createNetworkInterface({
  uri: 'http://192.168.1.175:8080/graphql'
});
const client = new ApolloClient({
  networkInterface: networkInterface
});

const App = () => (
  <ApolloProvider client={client}>
    <Scene />
  </ApolloProvider>
);

AppRegistry.registerComponent('UnvoterNews', () => App);
