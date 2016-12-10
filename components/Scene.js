import React, {Component} from 'react';
import {Navigator} from 'react-native';
import Home from './Home';
import Story from './Story';

class Scene extends Component {
  renderScene(route, navigator) {
    switch (route.id) {
      case 'STORY':
        return <Story
          navigator={navigator}
          {...route.passProps}
        />;
      case 'HOME':
      default:
        return <Home
          navigator={navigator}
          {...route.passProps}
        />;
    }
  }
  render() {
    return (
      <Navigator
        initialRoute={{title: 'HOME', index: 0}}
        renderScene={this.renderScene.bind(this)}
      />
    );
  }
}

export default Scene;
