import React from 'react';
import {AppRegistry} from 'react-native';
import ApolloClient, {createNetworkInterface} from 'apollo-client';
import {ApolloProvider} from 'react-apollo';
import Scene from './components/Scene';
import {API_URL} from './env';

const networkInterface = createNetworkInterface({
  uri: API_URL
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
