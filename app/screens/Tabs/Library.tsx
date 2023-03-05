import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {colors} from "../../constants/colors";
import Shape1 from "../../assets/vectors/shape1.svg";
import SegmentedControl from '@react-native-segmented-control/segmented-control';

const Library = () => {
  return (
    <View style={styles.container}>
      <View style={styles.shape1}><Shape1 fill={colors.fill}/></View>
      <Text style={styles.title}>Library</Text>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: colors.white,
  },
  shape1: {
    width: "100%",
    aspectRatio: 1,
    position: "absolute",
    top: 0
  },
  title: {
    position: "absolute",
    top: 60,
    left: 35,

    // font-family: 'Lato;,
    fontSize: 32,
    fontWeight: 'bold',

    color: colors.black,
  },
});

export default Library;