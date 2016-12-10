import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  WebView,
  TouchableOpacity
} from 'react-native';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import postContentUtility from '../services/postContentUtility';

const StoryQuery = gql`query getPost($id: Int!) {
  post(id:$id) {
    id
    post_title
    post_content
  }
}`;

class Story extends Component {
  back() {
    this.props.navigator.pop();
  }
  render() {
    if (this.props.data.loading) {
      return <Text>Loading...</Text>;
    }
    if (this.props.data.error) {
      throw this.props.data.error;
    }
    let rawContent = `${this.props.data.post.post_content}`;
    let parsedContent = postContentUtility.parsePostContent(rawContent);
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Unvoter News
        </Text>
        <TouchableOpacity
          style={{marginBottom: 5}}
          onPress={this.back.bind(this)}>
          <Text>Back</Text>
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 36,
            fontWeight: 'bold',
            backgroundColor: '#000',
            color: '#fff',
            padding: 10
          }}>
          {this.props.data.post.post_title}
        </Text>
        <WebView
          style={{
            marginLeft: -5,
            backgroundColor: 'transparent'
          }}
          contentInset={{top: 0, left: 0, bottom: 0, right: 0}}
          source={{html: parsedContent}}
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
