import {StyleSheet} from 'react-native';
import colors from './colors';
import {s} from 'react-native-size-matters';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scrollView: {
    paddingBottom: s(20),
  },
  separator: {
    marginLeft: s(20),
    height: 0.5,
    backgroundColor: colors.grey,
  },
});

export default styles;
