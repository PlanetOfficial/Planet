import {StyleSheet} from 'react-native';
import colors from './colors';
import {s} from 'react-native-size-matters';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollView: {
    paddingBottom: s(30),
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
  headerTitle: {
    fontSize: s(24),
    fontWeight: '700',
    color: colors.black,
  },
  headerIcon: {
    width: s(20),
    height: s(20),
    tintColor: colors.black,
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
  absolute: {
    position: 'absolute',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default styles;
