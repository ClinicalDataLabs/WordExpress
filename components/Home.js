import React, {Component} from 'react';
import {
  Text,
  View,
  ListView,
  TouchableOpacity
} from 'react-native';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import AppStyleSheet from '../styles/AppStyleSheet';
import Loading from './Loading';

const AllStoriesQuery = gql`query AllStories($limit: Int) { posts(limit: $limit) { id post_title } }`;

class Home extends Component {
  constructor() {
    super();
    this.ds = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    });
  }
  selectPost(postId) {
    this.props.navigator.push({
      id: 'POST',
      passProps: {
        id: postId
      }
    });
  }
  renderRow(post, sectionId, rowId) {
    return (
      <TouchableOpacity key={post.id}
        onPress={() => this.selectPost(post.id)}
        style={styles.postRow}>
        <Text
          style={styles.postHeadline}
          numberOfLines={1}>
          {post.post_title}
        </Text>
      </TouchableOpacity>
    );
  }
  render() {
    if (this.props.data.loading) {
      return <Loading />;
    }
    let dataSource = this.ds.cloneWithRows(this.props.data.posts);
    return (
      <View style={styles.container}>
        <ListView
          renderHeader={() => null}
          renderRow={this.renderRow.bind(this)}
          dataSource={dataSource}
          automaticallyAdjustContentInsets={false}
          enableEmptySections={true}
        />
      </View>
    );
  }
}

const styles = AppStyleSheet.create({
  postHeadline: {
    fontWeight: 'bold',
    fontSize: 18
  },
  postRow: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 10,
    paddingRight: 10,
    height: 40
  }
});

export default graphql(
  AllStoriesQuery, {
  options() {
    return {
      variables: {
        limit: 20
      }
    };
  }
})(Home);
