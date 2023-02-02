import React from 'react';
import { View, Text, StyleSheet, Dimensions, Button } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const CreatePlan = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Coming Soon</Text>
      <Button 
        title="Go to Next Screen" 
        onPress={() => navigation.navigate('MapSelection')} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: screenWidth,
    height: screenHeight
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold'
  }
});

export default CreatePlan;
