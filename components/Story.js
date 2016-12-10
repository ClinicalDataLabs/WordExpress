import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  WebView
} from 'react-native';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';

const StoryQuery = gql`query getPost($id: Int!) {
  post(id:$id) {
    id
    post_title
    post_content
  }
}`;

class Story extends Component {
  selectStory() {

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
        <Text style={styles.title}>
          {this.props.data.post.post_title}
        </Text>
        <WebView
          source={{html: this.props.data.post.post_content}}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    padding: 10
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10
  },
  content: {
  }
});

export default graphql(
  StoryQuery,
  ({id}) => ({variables: {id: id}})
)(Story);
