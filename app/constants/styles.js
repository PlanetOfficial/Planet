import {StyleSheet} from 'react-native';
import colors from './colors';
import {s} from 'react-native-size-matters';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
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
    backgroundColor: colors.dim,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: s(20),
    marginVertical: s(15),
  },
  separator: {
    marginHorizontal: s(20),
    height: 1,
    backgroundColor: colors.secondary,
  },
  separatorExtendsToRight: {
    marginLeft: s(20),
    height: 1,
    backgroundColor: colors.secondary,
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
    bottom: s(40),
    borderRadius: s(10),
    backgroundColor: colors.accent,
    shadowColor: colors.neutral,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,

    elevation: 7,
  },
  shadow: {
    shadowColor: colors.neutral,
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
  promptContainer: {
    margin: s(40),
    paddingHorizontal: s(20),
  },
  prompt: {
    width: s(100),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: s(30),
    marginHorizontal: s(50),
  },
  input: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: colors.darkgrey,
    marginHorizontal: s(5),
    paddingHorizontal: s(10),
    paddingVertical: s(5),
    fontFamily: 'Lato',
    color: colors.neutral,
  },
  buttonBig: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: s(30),
    width: s(150),
    height: s(50),
    borderRadius: s(25),
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
    borderBottomColor: colors.secondary,
    backgroundColor: colors.primary,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.accent,
    backgroundColor: colors.primary,
  },
  firstTab: {
    borderRightWidth: 0,
  },
  text: {
    fontSize: s(13),
    fontWeight: '600',
    fontFamily: 'Lato',
    color: colors.neutral,
  },
  activeText: {
    marginBottom: 0,
    color: colors.accent,
  },
});

export default styles;
