import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  WebView,
  Linking
} from 'react-native';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import postContentUtility from '../services/postContentUtility';
import AppStyleSheet from '../styles/AppStyleSheet';
import {Post} from '../models';

const PostQuery = gql`query getPost($id: Int!) {
  post(id:$id) {
    id
    post_title
    post_content
    post_meta(keys: ["author", "publication_date", "source_url", "source_name"]) {
      meta_key
      meta_value
    }
  }
}`;

const PostComponent = ({data}) => {
  if (data.loading) {
    return <Text style={styles.loading}>Loading...</Text>;
  }
  let post = new Post(data.post);

  const visitSource = () => {
    Linking.canOpenURL(post.source_url).then(supported => {
      if (supported) {
        Linking.openURL(post.source_url);
      }
    });
  };

  // const handleNavigation = navState => {
  //   if (navState.url.indexOf('http') === 0) {
  //     Linking.openURL(navState.url);
  //     return false;
  //   }
  //   return true;
  // }

  let rawContent = `${post.post_content}`;
  let parsedContent = postContentUtility.parsePostContent(rawContent);

  return (
    <View style={styles.container}>
      <View style={styles.banner}>
        {post.publication_date &&
          <Text style={{color: '#999'}}>
          {post.publication_date.tz('UTC').format('MMMM D, YYYY')}
          </Text>
        }
        <Text
          style={styles.title}>
          {post.post_title}
        </Text>
        <View style={{flexDirection: 'column'}}>
          {post.authors &&
            <Text style={{color: '#999'}}>
              by {post.authors.join(', ')}
            </Text>
          }
          {(post.source_name || post.source_url) &&
            <View style={{flexDirection: 'row'}}>
              <Text style={{color: '#999', marginRight: 5}}>
                Source:
              </Text>
              {post.source_url
                ? <TouchableOpacity onPress={visitSource}>
                    <Text style={{color: '#7e96e0'}}>{post.source_name}</Text>
                  </TouchableOpacity>
                : <Text style={{color: '#999'}}>{post.source_name || post.source_url}</Text>
              }
            </View>
          }
        </View>
      </View>
      <WebView
        style={styles.content}
        contentInset={{top: 0, left: 0, bottom: 0, right: 0}}
        source={{html: parsedContent}}
        onShouldStartLoadWithRequest={navState => {
          if (navState.navigationType === 'click') {
            Linking.openURL(navState.url);
            return false;
          }
          return true;
        }}
        onNavigationStateChange={navState => {
          if (navState.url.indexOf('http') === 0 && navState.canGoBack === false) {
            Linking.openURL(navState.url);
            return false;
          }
          return true;
        }}
      />
    </View>
  );
};

const styles = AppStyleSheet.create({
  banner: {
    backgroundColor: '#000',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    marginBottom: 10
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff'
  },
  content: {
    backgroundColor: 'transparent'
  }
});

export default graphql(
  PostQuery,
  ({id}) => ({variables: {id: id}})
)(PostComponent);
