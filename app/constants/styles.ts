import {StyleSheet} from 'react-native';
import colors from './colors';
import {s, vs} from 'react-native-size-matters';

const styling = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors[theme].background,
    },
    flatList: {
      paddingTop: s(10),
      paddingBottom: s(30),
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
      paddingHorizontal: s(15),
      paddingVertical: s(7.5),
      bottom: s(40),
      borderRadius: s(5),
      backgroundColor: colors[theme].accent,
    },
    shadow: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,

      elevation: 2,
    },
    absolute: {
      position: 'absolute',
    },
    flip: {
      transform: [{rotate: '180deg'}],
    },
    titleContainer: {
      marginTop: s(40),
      marginBottom: s(20),
    },
    prompt: {
      width: s(100),
    },
    error: {
      position: 'absolute',
      alignSelf: 'center',
    },
    inputContainer: {
      justifyContent: 'center',
      flexDirection: 'row',
      alignItems: 'center',
      width: s(250),
      margin: s(50),
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
      fontSize: s(15),
      backgroundColor: colors[theme].background,
    },
    signUpContainer: {
      flex: 1,
      width: '100%',
      alignItems: 'center',
    },
    logo: {
      marginTop: vs(10),
      width: s(60),
      height: s(60),
    },
    buttonBig: {
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: s(30),
      marginBottom: s(10),
      width: s(200),
      height: s(45),
      borderRadius: s(10),
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
    icon: {
      marginRight: s(10),
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
      borderColor: colors[theme].secondary,
      backgroundColor: colors[theme].background,
    },
    activeTab: {
      borderBottomWidth: 2,
      borderColor: colors[theme].accent,
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
