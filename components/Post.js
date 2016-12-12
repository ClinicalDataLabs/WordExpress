import React, {Component} from 'react';
import {
  Text,
  View,
  WebView,
  TouchableOpacity
} from 'react-native';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import postContentUtility from '../services/postContentUtility';
import AppStyleSheet from '../styles/AppStyleSheet';

const PostQuery = gql`query getPost($id: Int!) {
  post(id:$id) {
    id
    post_title
    post_content
  }
}`;

class Post extends Component {
  back() {
    this.props.navigator.pop();
  }
  render() {
    if (this.props.data.loading) {
      return <Text style={styles.loading}>Loading...</Text>;
    }
    let rawContent = `${this.props.data.post.post_content}`;
    let parsedContent = postContentUtility.parsePostContent(rawContent);
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={this.back.bind(this)}>
          <Text style={styles.backButtonText}>
            {'< Back'}
          </Text>
        </TouchableOpacity>
        <Text
          style={styles.postTitle}>
          {this.props.data.post.post_title}
        </Text>
        <WebView
          style={styles.postContent}
          contentInset={{top: 0, left: 0, bottom: 0, right: 0}}
          source={{html: parsedContent}}
        />
      </View>
    );
  }
}

const styles = AppStyleSheet.create({
  postTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    backgroundColor: '#000',
    color: '#fff',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    marginBottom: 10
  },
  postContent: {
    backgroundColor: 'transparent'
  },
  backButton: {
    backgroundColor: '#ddd'
  },
  backButtonText: {
    paddingBottom: 5,
    paddingTop: 5,
    paddingLeft: 10
  }
});

export default graphql(
  PostQuery,
  ({id}) => ({variables: {id: id}})
)(Post);
