import {StyleSheet} from 'react-native';
import colors from './colors';
import {s} from 'react-native-size-matters';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  flatList: {
    paddingTop: s(10),
  },
  scrollView: {
    paddingBottom: s(30),
  },
  center: {
    paddingVertical: s(50),
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  dim: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
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
  texts: {
    flex: 1,
    marginLeft: s(20),
  },
  button: {
    position: 'absolute',
    alignSelf: 'center',
    paddingHorizontal: s(20),
    paddingVertical: s(10),
    bottom: s(50),
    borderRadius: s(10),
    backgroundColor: colors.accent,
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
  flip: {
    transform: [{rotate: '180deg'}],
  },
});

export default styles;
