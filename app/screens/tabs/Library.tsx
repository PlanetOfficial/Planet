import React from 'react';
import {View, Text, StyleSheet, Dimensions, Image} from 'react-native';
import {colors} from "../../constants/colors";
import Hat from "../../assets/vectors/hat.svg";

const Library = () => {
  return (
    <View style={styles.container}>
      <View style={{ width: "100%", aspectRatio: 1, position: "absolute", top: 0}} >
        <Hat width="100%" height="100%" fill={colors.fill}/>
      </View>
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
