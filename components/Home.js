import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  TouchableOpacity
} from 'react-native';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';

const AllStoriesQuery = gql`query AllStories { posts { id post_title } }`;

class Home extends Component {
  constructor() {
    super();
    this.ds = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    });
  }
  selectStory(postId) {
    this.props.navigator.push({
      id: 'STORY',
      passProps: {
        id: postId
      }
    });
  }
  renderRow(post, sectionId, rowId) {
    return (
      <TouchableOpacity key={post.id} onPress={() => this.selectStory(post.id)}>
        <Text style={styles.headline}>
        {post.post_title}
        </Text>
      </TouchableOpacity>
    );
  }
  render() {
    if (this.props.data.loading) {
      return <Text>Loading...</Text>;
    }
    if (this.props.data.error) {
      throw this.props.data.error;
    }
    let dataSource = this.ds.cloneWithRows(this.props.data.posts);
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Unvoter News
        </Text>
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
