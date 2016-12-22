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

const AllStoriesQuery = gql`query AllCategories($parentCategoryId: Int) { categories(parent: $parentCategoryId) { term_id name subcategoriesCount} }`;

class Categories extends Component {
  constructor() {
    super();
    this.ds = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    });
  }
  selectCategory(category) {
    if (category.subcategoriesCount > 0) {
      this.props.navigator.push({
        id: 'CATEGORIES',
        passProps: {
          parentCategoryId: category.term_id
        }
      });
    } else {
      this.props.navigator.push({
        id: 'POSTS',
        passProps: {
          categoryId: category.term_id
        }
      });
    }
  }
  renderRow(category, sectionId, rowId) {
    return (
      <TouchableOpacity key={category.id}
        onPress={() => this.selectCategory(category)}
        style={styles.navRow}>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <Text
            style={styles.navHeadline}
            numberOfLines={1}>
            {category.name}
          </Text>
          <Icon name="chevron-right" style={styles.disclosureIcon}/>
        </View>
      </TouchableOpacity>
    );
  }
  render() {
    if (this.props.data.loading) {
      return <Loading />;
    }
    let dataSource = this.ds.cloneWithRows(this.props.data.categories);
    return (
      <View style={[styles.container, {borderTopWidth: 0.5, borderTopColor: '#ccc'}]}>
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
  navHeadline: {
    fontWeight: 'bold',
    color: '#000',
    fontSize: 18,
    flex: 1
  }
});

export default graphql(
  AllStoriesQuery, {
    options({parentCategoryId = 0}) {
      return {
        variables: {
          parentCategoryId: parentCategoryId
        }
      };
    }
  })(Categories);
