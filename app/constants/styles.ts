import {StyleSheet} from 'react-native';
import colors from './colors';
import {s} from 'react-native-size-matters';

const styling = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors[theme].background,
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
      backgroundColor: colors[theme].dim,
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
      backgroundColor: colors[theme].secondary,
    },
    separatorExtendsToRight: {
      marginLeft: s(20),
      height: 1,
      backgroundColor: colors[theme].secondary,
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
      backgroundColor: colors[theme].accent,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.29,
      shadowRadius: 4.65,

      elevation: 7,
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
      borderColor: colors[theme].secondary,
      marginHorizontal: s(5),
      paddingHorizontal: s(10),
      paddingVertical: s(5),
      fontFamily: 'Lato',
      color: colors[theme].neutral,
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
    sectionHeader: {
      marginHorizontal: s(20),
      paddingTop: s(10),
      paddingBottom: s(5),
      backgroundColor: colors[theme].background,
      borderBottomWidth: 1,
      borderColor: colors[theme].secondary,
    },
    settingsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: s(35),
      paddingVertical: s(20),
    },
  });

export const segControlTabStyling = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    container: {
      marginTop: s(10),
      paddingHorizontal: s(20),
      height: s(25),
    },
    tab: {
      borderWidth: 0,
      borderBottomWidth: 2,
      borderBottomColor: colors[theme].secondary,
      backgroundColor: colors[theme].background,
    },
    activeTab: {
      borderBottomWidth: 2,
      borderBottomColor: colors[theme].accent,
      backgroundColor: colors[theme].background,
    },
    firstTab: {
      borderRightWidth: 0,
    },
    text: {
      fontSize: s(13),
      fontWeight: '600',
      fontFamily: 'Lato',
      color: colors[theme].neutral,
    },
    activeText: {
      marginBottom: 0,
      color: colors[theme].accent,
    },
  });

export default styling;
