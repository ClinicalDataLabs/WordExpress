import React, {Component} from 'react';
import {Navigator, Platform, View, StatusBar, BackAndroid} from 'react-native';
import Categories from './Categories';
import Posts from './Posts';
import PostComponent from './PostComponent';
import AppStyleSheet from '../styles/AppStyleSheet';

class Scene extends Component {
  componentWillMount() {
    BackAndroid.addEventListener('hardwareBackPress', this.handleBackButton.bind(this));
  }
  componentWillUnmount() {
    BackAndroid.removeEventListener('hardwareBackPress', this.handleBackButton);
  }
  handleBackButton() {
    const {navigator} = this.refs;
    if (navigator && navigator.getCurrentRoutes().length > 1) {
      navigator.pop();
      return true;
    }
    return false; // exit the app
  }
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
      <View style={styles.container}>
        <StatusBar
          backgroundColor="#fff"
          barStyle="dark-content"
        />
        <Navigator
          ref="navigator"
          style={styles.scene}
          initialRoute={{title: 'CATEGORIES', index: 0}}
          renderScene={this.renderScene.bind(this)}
          configureScene={(route, routeStack) => Navigator.SceneConfigs.HorizontalSwipeJump}
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
        marginTop: 0
      },
      ios: {
        marginTop: 20
      }
    })
  }
});

export default Scene;
