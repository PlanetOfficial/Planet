import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {colors} from "../../constants/colors";
import Hat from "../../assets/vectors/hat.svg";


const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const Library = () => {
  return (
    <View style={styles.container}>
      <View style={styles.background}>
        <Hat width="100%" height="100%" fill={colors.fill} originY={0}/>
      </View>
      {/* <Text style={styles.text}>Coming Soon</Text> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: screenWidth,
    height: screenHeight,
    backgroundColor: colors.white,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    position: "absolute",
    top: 40,
  },
  background: {
    position: 'absolute',
    width: "100%",
    height: "100%",
  }
});

export default Library;