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
    marginHorizontal: s(20),
    height: 0.5,
    backgroundColor: colors.lightgrey,
  },
  separatorExtendsToRight: {
    marginLeft: s(20),
    height: 0.5,
    backgroundColor: colors.lightgrey,
  },
  texts: {
    flex: 1,
    marginHorizontal: s(10),
    justifyContent: 'center',
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

export const sctStyles = StyleSheet.create({
  container: {
    marginTop: s(10),
    paddingHorizontal: s(20),
    height: s(25),
  },
  tab: {
    borderWidth: 0,
    borderBottomWidth: 2,
    borderBottomColor: colors.grey,
    backgroundColor: colors.white,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.accent,
    backgroundColor: colors.white,
  },
  firstTab: {
    borderRightWidth: 0,
  },
  text: {
    fontSize: s(12),
    fontWeight: '600',
    fontFamily: 'Lato',
    color: colors.black,
  },
  activeText: {
    marginBottom: 0,
    color: colors.accent,
  },
});

export default styles;
