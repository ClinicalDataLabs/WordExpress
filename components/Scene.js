import React, {Component} from 'react';
import {Navigator, Platform} from 'react-native';
import Categories from './Categories';
import Posts from './Posts';
import PostComponent from './PostComponent';
import AppStyleSheet from '../styles/AppStyleSheet';

class Scene extends Component {
  renderScene(route, navigator) {
    switch (route.id) {
      case 'POST':
        return <PostComponent
          navigator={navigator}
          {...route.passProps}
        />;
      case 'POSTS':
        return <Posts
          navigator={navigator}
          {...route.passProps}
        />;
      case 'CATEGORIES':
      default:
        return <Categories
          navigator={navigator}
          {...route.passProps}
        />;
    }
  }
  render() {
    return (
      <Navigator
        style={styles.scene}
        initialRoute={{title: 'CATEGORIES', index: 0}}
        renderScene={this.renderScene.bind(this)}
        configureScene={(route, routeStack) => Navigator.SceneConfigs.HorizontalSwipeJump}
      />
    );
  }
}

const styles = AppStyleSheet.create({
  scene: {
    flex: 1,
    ...Platform.select({
      android: {
        marginTop: 0
      },
      ios: {
        marginTop: 20
      }
    })
  }
});

export default Scene;
