import {Platform, StyleSheet} from 'react-native';
import commonStyles from './commonStyles';

const AppStyleSheet = {
  create(styles = {}) {
    const styleKeys = Object.keys(styles);
    const keptStyles = commonStyles;
    styleKeys.forEach(key => {
      const {ios, android, ...style} = styles[key];
      keptStyles[key] = {...style, ...Platform.select({ios, android})};
    });
    return StyleSheet.create(keptStyles);
  }
};

export default AppStyleSheet;
