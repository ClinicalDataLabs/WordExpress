import React, {Component} from 'react';
import {Navigator, StatusBar, View, Platform} from 'react-native';
import Home from './Home';
import Post from './Post';
import AppStyleSheet from '../styles/AppStyleSheet';

class Scene extends Component {
  renderScene(route, navigator) {
    switch (route.id) {
      case 'POST':
        return <Post
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
      <View style={styles.scene}>
        <Navigator
          initialRoute={{title: 'HOME', index: 0}}
          renderScene={this.renderScene.bind(this)}
        />
      </View>
    );
  }
}

const styles = AppStyleSheet.create({
  scene: {
    flex: 1,
    ...Platform.select({
      android: {
        marginTop: StatusBar.currentHeight
      },
      ios: {
        marginTop: 20
      }
    })
  }
});

export default Scene;
