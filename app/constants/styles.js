import {StyleSheet} from 'react-native';
import colors from './colors';
import {s} from 'react-native-size-matters';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollView: {
    paddingBottom: s(20),
  },
  center: {
    paddingTop: s(50),
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    paddingHorizontal: s(20),
    marginVertical: s(10),
  },
  separator: {
    marginLeft: s(20),
    height: 0.5,
    backgroundColor: colors.lightgrey,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
});

export default styles;
