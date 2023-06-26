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

export default styles;
