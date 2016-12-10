import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  InteractionManager
} from 'react-native';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';

const AllStoriesQuery = gql`query AllStories { posts { id post_title } }`;

class Home extends Component {
  selectStory(postId) {
    InteractionManager.runAfterInteractions(() => {
      this.props.navigator.push({
        id: 'STORY',
        passProps: {
          id: postId
        }
      });
    });
  }
  render() {
    if (this.props.data.loading) {
      return <Text>Loading...</Text>;
    }
    if (this.props.data.error) {
      throw this.props.data.error;
    }
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Unvoter News
        </Text>
        {this.props.data.posts.map(post => <TouchableOpacity key={post.id} onPress={() => this.selectStory(post.id)}>
          <Text style={styles.headline}>
            {post.post_title}
            </Text>
          </TouchableOpacity>)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    padding: 10
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  },
  headline: {
    marginTop: 10,
    fontWeight: 'bold'
  }
});

export default graphql(AllStoriesQuery)(Home);
