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
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Post} from '../models';

const AllStoriesQuery = gql`query Category($categoryId: Int, $limit: Int, $skip: Int) {
  category(term_id: $categoryId) {
    term_id
    name
    posts(limit: $limit, skip: $skip) {
      id
      post_title
      post_meta(keys: ["publication_date", "source_name"]) {
        meta_key
        meta_value
      }
    }
  }
}`;

class Posts extends Component {
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
  renderRow(postData, sectionId, rowId) {
    let post = new Post(postData);
    return (
      <TouchableOpacity key={post.id}
        onPress={() => this.selectPost(post.id)}
        style={[styles.navRow, styles.postRow]}>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <View style={{flex: 1, flexDirection: 'column'}}>
            <Text
              style={styles.navHeadline}
              numberOfLines={1}>
              {post.post_title}
            </Text>
            {(post.publication_date || post.source_name) &&
              <View style={{flexDirection: 'row'}}>
                {post.source_name &&
                  <Text style={{fontWeight: '700', flex: 1, color: '#999'}}>
                    {post.source_name}
                  </Text>
                }
                {post.publication_date &&
                  <Text style={{color: '#999'}}>
                    {post.publication_date.format('MMMM D, YYYY')}
                  </Text>
                }
              </View>
            }
          </View>
          <Icon name="chevron-right" style={styles.disclosureIcon}/>
        </View>
      </TouchableOpacity>
    );
  }
  tryLoadMore() {
    return this.props.loadMorePosts();
  }
  render() {
    if (this.props.loading) {
      return <Loading />;
    }
    let dataSource = this.ds.cloneWithRows(this.props.category.posts);
    return (
      <View style={[styles.container, {borderTopWidth: 0.5, borderTopColor: '#ccc'}]}>
        <ListView
          renderHeader={() => null}
          renderRow={this.renderRow.bind(this)}
          dataSource={dataSource}
          automaticallyAdjustContentInsets={false}
          enableEmptySections={true}
          onEndReached={this.tryLoadMore.bind(this)}
        />
      </View>
    );
  }
}

const styles = AppStyleSheet.create({
  postRow: {
    height: 60
  }
});

export default graphql(
  AllStoriesQuery, {
    options({categoryId}) {
      return {
        variables: {
          categoryId: categoryId,
          limit: 20,
          skip: 0
        }
      };
    },
    props({data: {loading, category, fetchMore}}) {
      return {
        loading,
        category,
        loadMorePosts: () => {
          return fetchMore({
            variables: {
              skip: category.posts.length
            },
            updateQuery: (previousResult, {fetchMoreResult}) => {
              if (!fetchMoreResult.data) {
                return previousResult;
              }
              let newData = fetchMoreResult.data;
              newData.category.posts = [
                ...previousResult.category.posts,
                ...fetchMoreResult.data.category.posts
              ];
              return newData;
            }
          });
        }
      };
    }
  })(Posts);
