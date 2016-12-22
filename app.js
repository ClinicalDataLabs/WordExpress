import React from 'react';
import {AppRegistry} from 'react-native';
import ApolloClient, {createNetworkInterface} from 'apollo-client';
import {ApolloProvider} from 'react-apollo';
import Scene from './components/Scene';
import Config from 'react-native-config';

const networkInterface = createNetworkInterface({
  uri: Config.API_URL
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
